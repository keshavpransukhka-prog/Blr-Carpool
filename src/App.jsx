import { useEffect, useState } from 'react'
import { db, auth } from './firebase'
import { collection, onSnapshot, addDoc, query, where, getDocs } from 'firebase/firestore'
import { isSignInWithEmailLink, signInWithEmailLink, onAuthStateChanged, signOut } from 'firebase/auth'
import RideCard from './RideCard'
import RideForm from './RideForm'
import Login from './Login'

function App() {
  const [rides, setRides] = useState([])
  const [myRide, setMyRide] = useState(null)
  const [requests, setRequests] = useState([])
  const [matchedIds, setMatchedIds] = useState([])
  const [expandedSearch, setExpandedSearch] = useState(false)
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Handle magic link sign in
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn')
      if (!email) {
        email = window.prompt('Please provide your email for confirmation')
      }
      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          window.localStorage.removeItem('emailForSignIn')
          window.history.replaceState(null, '', '/')
        })
        .catch(err => console.error(err))
    }
  }, [])

  // Listen for auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      setAuthLoading(false)

      if (firebaseUser) {
        // Check if user already has a ride posted
        const q = query(collection(db, 'rides'), where('userId', '==', firebaseUser.uid))
        const snapshot = await getDocs(q)
        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          const ride = { id: doc.id, ...doc.data() }
          // Only restore if within 24 hours
          const ageHours = (new Date() - new Date(ride.createdAt)) / (1000 * 60 * 60)
          if (ageHours <= 24) {
            setMyRide(ride)
          }
        }
      } else {
        setMyRide(null)
      }
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'rides'), function(snapshot) {
      setRides(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'requests'), function(snapshot) {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (!myRide || requests.length === 0) return
    requests.forEach(function(r) {
      if (r.toId === myRide.id) {
        const iSentToThem = requests.some(req => req.fromId === myRide.id && req.toId === r.fromId)
        if (iSentToThem && !matchedIds.includes(r.fromId)) {
          setMatchedIds(prev => [...prev, r.fromId])
          sendNotification(r.fromName)
        }
      }
    })
  }, [requests, myRide])

  function requestNotificationPermission() {
    if ('Notification' in window) Notification.requestPermission()
  }

  function sendNotification(name) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🎉 Carpool Match Found!', {
        body: `You matched with ${name}! Open the app to see their number.`,
        icon: '/vite.svg'
      })
    }
  }

  async function handleRequest(toRide) {
    if (!myRide) return
    await addDoc(collection(db, 'requests'), {
      fromId: myRide.id,
      fromName: myRide.name,
      fromPhone: myRide.phone,
      toId: toRide.id,
      toName: toRide.name,
      toPhone: toRide.phone,
    })
  }

  function handleRidePosted(ride) {
    setMyRide(ride)
    requestNotificationPermission()
  }

  function isMatched(toRide) {
    if (!myRide) return false
    const iSent = requests.some(r => r.fromId === myRide.id && r.toId === toRide.id)
    const theySent = requests.some(r => r.fromId === toRide.id && r.toId === myRide.id)
    return iSent && theySent
  }

  function iRequested(toRide) {
    if (!myRide) return false
    return requests.some(r => r.fromId === myRide.id && r.toId === toRide.id)
  }

  const now = new Date()
  const requestsToMe = myRide ? requests.filter(r => r.toId === myRide.id) : []
  const mySentRequests = myRide ? requests.filter(r => r.fromId === myRide.id) : []

  const filteredRides = rides.filter(function(ride) {
    if (!myRide) return false
    if (ride.id === myRide.id) return false
    const rideTime = new Date(ride.time)
    const diffMinutes = Math.abs(rideTime - now) / (1000 * 60)
    if (!expandedSearch && diffMinutes > 60) return false
    if (expandedSearch && diffMinutes > 180) return false
    if (!ride.createdAt) return true
    const ageHours = (now - new Date(ride.createdAt)) / (1000 * 60 * 60)
    if (ageHours > 24) return false
    if (!expandedSearch) {
      if (myRide.genderPref === 'Male only' && ride.gender !== 'Male') return false
      if (myRide.genderPref === 'Female only' && ride.gender !== 'Female') return false
      if (myRide.locationPrefs && myRide.locationPrefs.length > 0) {
        if (!myRide.locationPrefs.includes(ride.destination)) return false
      }
    }
    return true
  })

  if (authLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div>
        <h1>✈️ BLR Carpool</h1>
        <p className="subtitle">Share a cab from Bangalore Airport</p>
        <Login />
      </div>
    )
  }

  return (
    <div>
      <h1>✈️ BLR Carpool</h1>
      <p className="subtitle">Share a cab from Bangalore Airport</p>

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button
          onClick={() => signOut(auth)}
          style={{
            background: 'none',
            border: 'none',
            color: '#888',
            fontSize: '0.8rem',
            cursor: 'pointer',
            fontFamily: 'Segoe UI, sans-serif'
          }}
        >
          Sign out
        </button>
      </div>

      {/* Confirmation or Form */}
      {!myRide && <RideForm onRidePosted={handleRidePosted} userId={user.uid} />}
      {myRide && (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: '#e6f9f0', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '1rem', flexShrink: 0
          }}>✅</div>
          <div>
            <p style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '0.95rem', marginBottom: '0.1rem' }}>
              You're listed!
            </p>
            <p style={{ color: '#888', fontSize: '0.82rem', marginBottom: 0 }}>
              {myRide.name} · {myRide.destination}
            </p>
          </div>
        </div>
      )}

      {/* Requests sent */}
      {mySentRequests.length > 0 && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <p className="section-title">📤 Requests Sent</p>
          {mySentRequests.map(r => (
            <div key={r.id} className="match-item">
              <p style={{ fontSize: '0.9rem', color: '#333' }}>{r.toName}</p>
              {isMatched({ id: r.toId })
                ? <span className="tag tag-matched">🎉 Matched!</span>
                : <span className="tag tag-requested">Pending</span>
              }
            </div>
          ))}
        </div>
      )}

      {/* Requests received */}
      {requestsToMe.length > 0 && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <p className="section-title">📥 Requests Received</p>
          {requestsToMe.map(r => {
            const theirRide = rides.find(ride => ride.id === r.fromId)
            const alreadyRequested = requests.some(req => req.fromId === myRide.id && req.toId === r.fromId)
            const matched = isMatched({ id: r.fromId })
            return (
              <div key={r.id} className="match-item">
                <div>
                  <p style={{ fontSize: '0.9rem', color: '#333', fontWeight: '600' }}>{r.fromName}</p>
                  {matched && (
                    <p style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: '600' }}>
                      🎉 Matched! {r.fromPhone}
                    </p>
                  )}
                </div>
                {!matched && !alreadyRequested && theirRide && (
                  <button className="btn-accept" onClick={() => handleRequest(theirRide)}>
                    Accept
                  </button>
                )}
                {!matched && alreadyRequested && (
                  <span className="tag tag-requested">Sent ✓</span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Available matches */}
      <div style={{ marginTop: '1rem' }}>
        {filteredRides.length === 0 ? (
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>
              No matches found near your arrival time
            </p>
            {!expandedSearch && (
              <button className="btn-secondary" onClick={() => setExpandedSearch(true)}>
                🔍 Expand Search
              </button>
            )}
            {expandedSearch && (
              <p style={{ color: '#5b6af0', fontSize: '0.85rem' }}>Showing ±3 hours, all areas</p>
            )}
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <p style={{ fontWeight: '700', fontSize: '0.85rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {filteredRides.length} Match{filteredRides.length > 1 ? 'es' : ''} Found
              </p>
              {!expandedSearch && (
                <button className="btn-secondary" onClick={() => setExpandedSearch(true)}>
                  🔍 Expand
                </button>
              )}
            </div>
            {filteredRides.map(function(ride) {
              const matched = isMatched(ride)
              const requested = iRequested(ride)
              return (
                <RideCard
                  key={ride.id}
                  name={ride.name}
                  gender={ride.gender}
                  time={ride.time}
                  destination={ride.destination}
                  phone={matched ? ride.phone : null}
                  requested={requested}
                  matched={matched}
                  onRequest={() => handleRequest(ride)}
                />
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}

export default App