import { useState } from 'react'
import { db } from './firebase'
import { addDoc, collection } from 'firebase/firestore'

function RideCard({ name, gender, time, destination, phone, requested, matched, onRequest, myRideId, createdAt, myGenderPref }) {
  const date = new Date(time)
  const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  const dateStr = date.toLocaleDateString('en-IN', { month: 'long', day: 'numeric' })
  const [feedback, setFeedback] = useState(null)

  // How long ago they posted
  const minsAgo = createdAt
    ? Math.floor((new Date() - new Date(createdAt)) / (1000 * 60))
    : null

  const timeAgo = minsAgo === null ? '' :
    minsAgo < 1 ? 'just now' :
    minsAgo < 60 ? `${minsAgo} min ago` :
    `${Math.floor(minsAgo / 60)}hr ago`

  function openWhatsApp() {
    const message = `Hi ${name}! We matched on BLR Carpool ✈️ I'm also heading to ${destination} around the same time. Want to share a cab?`
    const url = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  async function handleFeedback(didCarpool) {
    setFeedback(didCarpool)
    await addDoc(collection(db, 'feedback'), {
      myRideId, matchedName: name, didCarpool,
      createdAt: new Date().toISOString()
    })
  }

  return (
    <div className="card" style={{ marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontWeight: '700', fontSize: '1rem', color: '#1a1a2e', marginBottom: '0.1rem' }}>
            {name}
            {myGenderPref !== 'No preference' && (
              <span style={{ fontWeight: '400', fontSize: '0.85rem', color: '#888', marginLeft: '0.4rem' }}>({gender})</span>
            )}
          </p>
          <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '0.1rem' }}>
            📍 {destination}
          </p>
          {timeAgo && (
            <p style={{ fontSize: '0.78rem', color: minsAgo > 45 ? '#f59e0b' : '#16a34a', marginTop: '0.2rem' }}>
              🕐 Posted {timeAgo}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
          {matched && <span className="tag tag-matched">✓ Matched</span>}
          {!matched && requested && <span className="tag tag-requested">Sent</span>}
        </div>
      </div>

      {matched && (
        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f0f2f5' }}>
          <p style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: '600', marginBottom: '0.75rem' }}>
            🎉 It's a match! Phone: {phone}
          </p>
          <div style={{
            background: '#fffbeb', border: '1px solid #fde68a',
            borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem'
          }}>
            <p style={{ fontSize: '0.78rem', color: '#92400e', lineHeight: '1.5', marginBottom: 0, textAlign: 'left' }}>
              🛡️ <strong>Safety tip:</strong> Meet in a public area and exchange a valid photo ID before sharing the cab.
            </p>
          </div>
          <button className="btn-whatsapp" onClick={openWhatsApp}>
            💬 Message on WhatsApp
          </button>

          {feedback === null ? (
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f0f2f5' }}>
              <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>
                Did you successfully carpool with {name}?
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleFeedback(true)} style={{
                  padding: '0.4rem 1rem', borderRadius: '8px',
                  border: '1.5px solid #16a34a', background: 'white',
                  color: '#16a34a', fontSize: '0.85rem', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'Segoe UI, sans-serif'
                }}>👍 Yes!</button>
                <button onClick={() => handleFeedback(false)} style={{
                  padding: '0.4rem 1rem', borderRadius: '8px',
                  border: '1.5px solid #ddd', background: 'white',
                  color: '#888', fontSize: '0.85rem', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'Segoe UI, sans-serif'
                }}>👎 No</button>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: '600', marginTop: '0.75rem' }}>
              {feedback ? '🎉 Awesome! Thanks for using BLR Carpool!' : '😔 Sorry it didn\'t work out. Try expanding your search!'}
            </p>
          )}
        </div>
      )}

      {!matched && !requested && (
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
          <button className="btn-request" onClick={onRequest}>
            Request Carpool
          </button>
        </div>
      )}
      {!matched && (
  <button
    onClick={onReport}
    style={{
      marginTop: '0.5rem', background: 'none', border: 'none',
      color: '#ddd', fontSize: '0.75rem', cursor: 'pointer',
      fontFamily: 'Segoe UI, sans-serif', padding: 0
    }}
  >
    Report this person
  </button>
)}
    </div>
  )
}

export default RideCard