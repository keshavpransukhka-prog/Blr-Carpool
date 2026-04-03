function RideCard({ name, gender, time, destination, phone, requested, matched, onRequest }) {
  const date = new Date(time)
  const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  const dateStr = date.toLocaleDateString('en-IN', { month: 'long', day: 'numeric' })

  function openWhatsApp() {
    const message = `Hi ${name}! We matched on BLR Carpool ✈️ I'm also heading to ${destination} around the same time. Want to share a cab?`
    const url = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <div className="card" style={{ marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontWeight: '700', fontSize: '1rem', color: '#1a1a2e', marginBottom: '0.1rem' }}>
            {name}
            <span style={{ fontWeight: '400', fontSize: '0.85rem', color: '#888', marginLeft: '0.4rem' }}>({gender})</span>
          </p>
          <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '0.1rem' }}>
            🕐 {timeStr} · {dateStr}
          </p>
          <p style={{ fontSize: '0.85rem', color: '#555' }}>
            📍 {destination}
          </p>
        </div>
        {matched && <span className="tag tag-matched">✓ Matched</span>}
        {!matched && requested && <span className="tag tag-requested">Sent</span>}
      </div>

      {matched && (
        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f0f2f5' }}>
          <p style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: '600', marginBottom: '0.75rem' }}>
            🎉 It's a match! Phone: {phone}
          </p>
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '8px',
            padding: '0.75rem',
            marginBottom: '0.75rem'
          }}>
            <p style={{ fontSize: '0.78rem', color: '#92400e', lineHeight: '1.5', marginBottom: 0 }}>
              🛡️ <strong>Safety tip:</strong> We recommend meeting your match in a public area at the airport and exchanging a valid photo ID before sharing the cab.
            </p>
          </div>
          <button className="btn-whatsapp" onClick={openWhatsApp}>
            💬 Message on WhatsApp
          </button>
        </div>
      )}

      {!matched && !requested && (
        <button className="btn-request" onClick={onRequest}>
          Request Carpool
        </button>
      )}
    </div>
  )
}

export default RideCard