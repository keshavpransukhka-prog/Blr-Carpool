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

  function requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission()
    }
  }

  function sendNotification(name, phone) {
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

  // Watch for new matches and send notifications
  useEffect(() => {
    if (!myRide || requests.length === 0) return

    requests.forEach(function(r) {
      if (r.toId === myRide.id) {
        const theySentToMe = true
        const iSentToThem = requests.some(req => req.fromId === myRide.id && req.toId === r.fromId)

        if (theySentToMe && iSentToThem && !matchedIds.includes(r.fromId)) {
          setMatchedIds(prev => [...prev, r.fromId])
          sendNotification(r.fromName, r.fromPhone)
        }
      }
    })
  }, [requests, myRide])

  async function handleRequest(toRide) {
    if (!myRide) {
      alert('Please post your own ride first!')
      return
    }

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

  const filteredRides = rides.filter(function(ride) {
    if (myRide && ride.id === myRide.id) return false
    const rideTime = new Date(ride.time)
    const diffMinutes = Math.abs(rideTime - now) / (1000 * 60)
    if (diffMinutes > 60) return false
    if (!ride.createdAt) return true
    const createdAt = new Date(ride.createdAt)
    const ageHours = (now - createdAt) / (1000 * 60 * 60)
    if (ageHours > 24) return false
    if (myRide && myRide.genderPref === 'Male only' && ride.gender !== 'Male') return false
    if (myRide && myRide.genderPref === 'Female only' && ride.gender !== 'Female') return false
    return true
  })

  return (
    <div>
      <h1>✈️ BLR Carpool</h1>
      <p>Find someone to share a cab with from Bangalore Airport</p>

      <RideForm onRidePosted={handleRidePosted} />

      <div className="ride-list">
        {filteredRides.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', marginTop: '1rem' }}>
            No carpool matches found yet. Check back soon!
          </p>
        ) : (
          <>
            <p style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>
              You can carpool with the following people:
            </p>
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