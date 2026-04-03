import { useEffect, useState } from 'react'
import { db } from './firebase'
import { collection, onSnapshot, addDoc } from 'firebase/firestore'
import RideCard from './RideCard'
import RideForm from './RideForm'

function App() {
  const [rides, setRides] = useState([])
  const [myRide, setMyRide] = useState(null)
  const [requests, setRequests] = useState([])
  const [matchedIds, setMatchedIds] = useState([])
  const [expandedSearch, setExpandedSearch] = useState(false)

  function requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission()
    }
  }

  function sendNotification(name) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🎉 Carpool Match Found!', {
        body: `You matched with ${name}! Open the app to see their number.`,
        icon: '/vite.svg'
      })
    }
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'rides'), function(snapshot) {
      const rideList = snapshot.docs.map(function(doc) {
        return { id: doc.id, ...doc.data() }
      })
      setRides(rideList)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'requests'), function(snapshot) {
      const requestList = snapshot.docs.map(function(doc) {
        return { id: doc.id, ...doc.data() }
      })
      setRequests(requestList)
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
    const iSentRequest = requests.some(r => r.fromId === myRide.id && r.toId === toRide.id)
    const theySentRequest = requests.some(r => r.fromId === toRide.id && r.toId === myRide.id)
    return iSentRequest && theySentRequest
  }

  function iRequested(toRide) {
    if (!myRide) return false
    return requests.some(r => r.fromId === myRide.id && r.toId === toRide.id)
  }

  const now = new Date()

  // People who requested me
  const requestsToMe = myRide
    ? requests.filter(r => r.toId === myRide.id)
    : []

  // My sent requests
  const mySentRequests = myRide
    ? requests.filter(r => r.fromId === myRide.id)
    : []

  const filteredRides = rides.filter(function(ride) {
    if (!myRide) return false
    if (ride.id === myRide.id) return false

    const rideTime = new Date(ride.time)
    const diffMinutes = Math.abs(rideTime - now) / (1000 * 60)
    if (!expandedSearch && diffMinutes > 60) return false
    if (expandedSearch && diffMinutes > 180) return false

    if (!ride.createdAt) return true
    const createdAt = new Date(ride.createdAt)
    const ageHours = (now - createdAt) / (1000 * 60 * 60)
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

  if (!myRide) {
    return (
      <div>
        <h1>✈️ BLR Carpool</h1>
        <p>Find someone to share a cab with from Bangalore Airport</p>
        <RideForm onRidePosted={handleRidePosted} />
      </div>
    )
  }

  return (
    <div>
      <h1>✈️ BLR Carpool</h1>
      <p>Find someone to share a cab with from Bangalore Airport</p>

      {/* Confirmation banner */}
      <div style={{
        background: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <span style={{ fontSize: '1.5rem' }}>✅</span>
        <div>
          <p style={{ fontWeight: '600', color: '#1a1a2e' }}>Your details have been collected!</p>
          <p style={{ color: '#666', fontSize: '0.85rem' }}>Looking for matches for <strong>{myRide.name}</strong> going to <strong>{myRide.destination}</strong></p>
        </div>
      </div>

      {/* Requests sent by me */}
      {mySentRequests.length > 0 && (
        <div style={{
          background: '#eff6ff',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          border: '1px solid #bfdbfe'
        }}>
          <p style={{ fontWeight: '600', color: '#1e40af', marginBottom: '0.5rem' }}>
            📤 Carpool Requests You Sent ({mySentRequests.length})
          </p>
          {mySentRequests.map(r => (
            <p key={r.id} style={{ fontSize: '0.9rem', color: '#333', padding: '0.25rem 0' }}>
              → {r.toName} going to {r.toName}
              {isMatched({ id: r.toId }) && <span style={{ color: '#16a34a', fontWeight: '600' }}> 🎉 Matched!</span>}
            </p>
          ))}
        </div>
      )}

      {/* Requests from others to me */}
      {requestsToMe.length > 0 && (
        <div style={{
          background: '#fef9c3',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          border: '1px solid #fde047'
        }}>
          <p style={{ fontWeight: '600', color: '#854d0e', marginBottom: '0.5rem' }}>
            📥 People Who Requested You ({requestsToMe.length})
          </p>
          {requestsToMe.map(r => {
            const theirRide = rides.find(ride => ride.id === r.fromId)
            const alreadyRequested = requests.some(req => req.fromId === myRide.id && req.toId === r.fromId)
            const matched = isMatched({ id: r.fromId })
            return (
              <div key={r.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                borderBottom: '1px solid #fde047'
              }}>
                <p style={{ fontSize: '0.9rem', color: '#333' }}>
                  {r.fromName}
                  {matched && <span style={{ color: '#16a34a', fontWeight: '600' }}> 🎉 Matched! {r.fromPhone}</span>}
                </p>
                {!matched && !alreadyRequested && theirRide && (
                  <button
                    onClick={() => handleRequest(theirRide)}
                    style={{
                      padding: '0.4rem 0.75rem',
                      background: '#4f46e5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.8rem'
                    }}
                  >
                    Accept
                  </button>
                )}
                {alreadyRequested && !matched && (
                  <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Request Sent ✓</span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Available matches */}
      <div className="ride-list">
        {filteredRides.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p style={{ color: '#999' }}>
              No carpool matches found yet. Check back soon!
            </p>
            {!expandedSearch && (
              <button
                onClick={() => setExpandedSearch(true)}
                style={{
                  marginTop: '1rem',
                  padding: '0.6rem 1.25rem',
                  background: '#f0f4f8',
                  color: '#4f46e5',
                  border: '2px solid #4f46e5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                🔍 Expand Search (±3 hours, ignore filters)
              </button>
            )}
            {expandedSearch && (
              <p style={{ color: '#4f46e5', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Showing expanded results (±3 hours, all areas)
              </p>
            )}
          </div>
        ) : (
          <>
            <p style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>
              You can carpool with the following people: ({filteredRides.length} match{filteredRides.length > 1 ? 'es' : ''})
              {expandedSearch && <span style={{ color: '#4f46e5', fontSize: '0.85rem', marginLeft: '0.5rem' }}>(expanded search)</span>}
            </p>
            {!expandedSearch && (
              <button
                onClick={() => setExpandedSearch(true)}
                style={{
                  marginBottom: '1rem',
                  padding: '0.4rem 0.75rem',
                  background: 'white',
                  color: '#4f46e5',
                  border: '1px solid #4f46e5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                🔍 Expand Search
              </button>
            )}
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