function RideCard({ name, gender, time, destination, phone, requested, matched, onRequest }) {
  const date = new Date(time)
  const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  const dateStr = date.toLocaleDateString('en-IN', { month: 'long', day: 'numeric' })

  function openWhatsApp() {
    const message = `Hi ${name}! We matched on BLR Carpool 🛫 I'm also heading to ${destination} around the same time. Want to share a cab?`
    const url = `https://wa.me/91${phone.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <div style={{
      background: 'white',
      padding: '1rem 1.5rem',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      fontSize: '0.95rem',
      lineHeight: '1.6'
    }}>
      <p>
        <strong>{name}</strong> ({gender}) is landing at <strong>{timeStr}</strong> on <strong>{dateStr}</strong> and going to <strong>{destination}</strong>
      </p>

      {matched && (
        <div style={{ marginTop: '0.75rem' }}>
          <p style={{ color: '#16a34a', fontWeight: '600' }}>
            🎉 It's a match!
          </p>
          <button
            onClick={openWhatsApp}
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              background: '#25D366',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem'
            }}
          >
            💬 Message on WhatsApp
          </button>
        </div>
      )}

      {!matched && (
        <button
          onClick={onRequest}
          disabled={requested}
          style={{
            marginTop: '0.75rem',
            padding: '0.5rem 1rem',
            background: requested ? '#e5e7eb' : '#4f46e5',
            color: requested ? '#6b7280' : 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: requested ? 'default' : 'pointer',
            fontWeight: '600',
            fontSize: '0.85rem'
          }}
        >
          {requested ? 'Request Sent ✓' : 'Request Carpool'}
        </button>
      )}
    </div>
  )
}

export default RideCard