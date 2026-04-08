import { useEffect, useState } from 'react'
import { db, auth } from './firebase'
import { collection, onSnapshot, addDoc, query, where, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore'
import { isSignInWithEmailLink, signInWithEmailLink, onAuthStateChanged, signOut } from 'firebase/auth'
import RideCard from './RideCard'
import RideForm from './RideForm'
import Login from './Login'

function App() {
  const [rides, setRides] = useState([])
  const [myRide, setMyRide] = useState(null)
  const [requests, setRequests] = useState([])
  const [matchedIds, setMatchedIds] = useState([])
  const [savedMatches, setSavedMatches] = useState([])
  const [expandedSearch, setExpandedSearch] = useState(false)
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn')
      if (!email) {
        email = window.prompt('Please provide your email for confirmation')
      }
      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          window.localStorage.removeItem('emailForSignIn')
          window.location.href = '/app'
        })
        .catch(err => console.error(err))
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      setAuthLoading(false)
      if (firebaseUser) {
        // Restore ride
        const rideQ = query(collection(db, 'rides'), where('userId', '==', firebaseUser.uid))
        const rideSnap = await getDocs(rideQ)
        if (!rideSnap.empty) {
          const docSnap = rideSnap.docs[0]
          const ride = { id: docSnap.id, ...docSnap.data() }
          const ageHours = (new Date() - new Date(ride.createdAt)) / (1000 * 60 * 60)
          if (ageHours <= 24) setMyRide(ride)
        }

        // Restore saved matches
        const matchQ = query(collection(db, 'matches'), where('userId', '==', firebaseUser.uid))
        const matchSnap = await getDocs(matchQ)
        if (!matchSnap.empty) {
          setSavedMatches(matchSnap.docs.map(d => d.data()))
        }
      } else {
        setMyRide(null)
        setSavedMatches([])
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

  // Detect new matches and save them
  useEffect(() => {
    if (!myRide || requests.length === 0 || !user) return
    requests.forEach(async function(r) {
      if (r.toId === myRide.id) {
        const iSentToThem = requests.some(req => req.fromId === myRide.id && req.toId === r.fromId)
        if (iSentToThem && !matchedIds.includes(r.fromId)) {
          setMatchedIds(prev => [...prev, r.fromId])
          sendNotification(r.fromName)

          // Save match to Firebase
          const matchId = `${user.uid}_${r.fromId}`
          await setDoc(doc(db, 'matches', matchId), {
            userId: user.uid,
            matchedRideId: r.fromId,
            matchedName: r.fromName,
            matchedPhone: r.fromPhone,
            matchedAt: new Date().toISOString()
          })

          setSavedMatches(prev => {
            const exists = prev.some(m => m.matchedRideId === r.fromId)
            if (exists) return prev
            return [...prev, {
              userId: user.uid,
              matchedRideId: r.fromId,
              matchedName: r.fromName,
              matchedPhone: r.fromPhone,
              matchedAt: new Date().toISOString()
            }]
          })
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
      fromId: myRide.id, fromName: myRide.name, fromPhone: myRide.phone,
      toId: toRide.id, toName: toRide.name, toPhone: toRide.phone,
    })
  }

  async function handleCancelListing() {
    if (!myRide) return
    if (!window.confirm('Cancel your listing? You\'ll need to repost if you want to find a carpool.')) return
    await deleteDoc(doc(db, 'rides', myRide.id))
    setMyRide(null)
  }

  function handleRidePosted(ride) {
    setMyRide(ride)
    requestNotificationPermission()
  }

  function handleShare() {
    const text = `I'm using BLR Carpool to find someone to share a cab with from Bangalore Airport! Join me: https://blr-carpool.vercel.app`
    if (navigator.share) {
      navigator.share({ title: 'BLR Carpool', text, url: 'https://blr-carpool.vercel.app' })
    } else {
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`
      window.open(url, '_blank')
    }
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

  const activeUsers = rides.filter(ride => {
    if (!ride.createdAt) return false
    const ageMinutes = (now - new Date(ride.createdAt)) / (1000 * 60)
    return ageMinutes <= 60
  }).length

  const requestsToMe = myRide ? requests.filter(r => r.toId === myRide.id) : []
  const mySentRequests = myRide ? requests.filter(r => r.fromId === myRide.id) : []

  const filteredRides = rides.filter(function(ride) {
    if (!myRide) return false
    if (ride.id === myRide.id) return false
    if (!ride.createdAt) return false
    const ageHours = (now - new Date(ride.createdAt)) / (1000 * 60 * 60)
    if (ageHours > 24) return false
    const myPostedTime = new Date(myRide.createdAt)
    const theirPostedTime = new Date(ride.createdAt)
    const diffMinutes = Math.abs(myPostedTime - theirPostedTime) / (1000 * 60)
    if (!expandedSearch && diffMinutes > 60) return false
    if (expandedSearch && diffMinutes > 180) return false
    if (!expandedSearch) {
      if (myRide.genderPref === 'Male only' && ride.gender !== 'Male') return false
      if (myRide.genderPref === 'Female only' && ride.gender !== 'Female') return false
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
        {activeUsers > 0 && (
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <span style={{
              background: '#e6f9f0', color: '#16a34a',
              padding: '0.35rem 0.85rem', borderRadius: '100px',
              fontSize: '0.8rem', fontWeight: 600
            }}>
              🟢 {activeUsers} {activeUsers === 1 ? 'person' : 'people'} looking right now
            </span>
          </div>
        )}
        <Login />
      </div>
    )
  }

  return (
    <div>
      <h1>✈️ BLR Carpool</h1>
      <p className="subtitle">Share a cab from Bangalore Airport</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        {activeUsers > 0 && (
          <span style={{
            background: '#e6f9f0', color: '#16a34a',
            padding: '0.35rem 0.85rem', borderRadius: '100px',
            fontSize: '0.8rem', fontWeight: 600
          }}>
            🟢 {activeUsers} looking now
          </span>
        )}
        <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto' }}>
          <button onClick={handleShare} style={{
            background: 'none', border: 'none', color: '#5b6af0',
            fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
            fontFamily: 'Segoe UI, sans-serif'
          }}>📤 Share</button>
          <button onClick={() => signOut(auth)} style={{
            background: 'none', border: 'none', color: '#888',
            fontSize: '0.8rem', cursor: 'pointer',
            fontFamily: 'Segoe UI, sans-serif'
          }}>Sign out</button>
        </div>
      </div>

      {!myRide && <RideForm onRidePosted={handleRidePosted} userId={user.uid} />}

      {myRide && (
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: '#e6f9f0', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1rem', flexShrink: 0
            }}>✅</div>
            <div>
              <p style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '0.95rem', marginBottom: '0.1rem' }}>You're listed!</p>
              <p style={{ color: '#888', fontSize: '0.82rem', marginBottom: 0 }}>{myRide.name} · {myRide.destination}</p>
            </div>
          </div>
          <button onClick={handleCancelListing} style={{
            background: 'none', border: 'none', color: '#e53e3e',
            fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600,
            fontFamily: 'Segoe UI, sans-serif'
          }}>Cancel</button>
        </div>
      )}

      {/* Saved match history */}
      {savedMatches.length > 0 && (
        <div className="card" style={{ marginTop: '1rem', background: '#e6f9f0', border: '1.5px solid #bbf7d0' }}>
          <p className="section-title" style={{ color: '#16a34a' }}>🎉 Your Matches</p>
          {savedMatches.map((m, i) => (
            <div key={i} className="match-item">
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1a1a2e' }}>{m.matchedName}</p>
                <p style={{ fontSize: '0.82rem', color: '#16a34a' }}>📞 {m.matchedPhone}</p>
              </div>
              <button
                onClick={() => {
                  const msg = `Hi ${m.matchedName}! We matched on BLR Carpool ✈️ Want to share a cab?`
                  window.open(`https://wa.me/91${m.matchedPhone}?text=${encodeURIComponent(msg)}`, '_blank')
                }}
                className="btn-whatsapp"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
              >
                💬 WhatsApp
              </button>
            </div>
          ))}
        </div>
      )}

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

      {requestsToMe.length > 0 && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <p className="section-title">📥 Requests Received</p>
          {requestsToMe.map(r => {
            const theirRide = rides.find(ride => ride.id === r.fromId)
            const alreadyRequested = requests.some(req => req.fromId === myRide?.id && req.toId === r.fromId)
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
                  <button className="btn-accept" onClick={() => handleRequest(theirRide)}>Accept</button>
                )}
                {!matched && alreadyRequested && (
                  <span className="tag tag-requested">Sent ✓</span>
                )}
              </div>
            )
          })}
        </div>
      )}

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
                <button className="btn-secondary" onClick={() => setExpandedSearch(true)}>🔍 Expand</button>
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
  myRideId={myRide?.id}
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