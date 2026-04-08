import { useState } from 'react'
import { db } from './firebase'
import { collection, addDoc } from 'firebase/firestore'

const BANGALORE_AREAS = [
  { label: 'Indiranagar / Marathahalli', value: 'Indiranagar / Jeevan Bima Nagar / Kadubeesanahalli / Marathahalli' },
  { label: 'Koramangala / BTM / HSR', value: 'Koramangala / BTM Layout / HSR Layout' },
  { label: 'Whitefield / ITPL', value: 'Whitefield / ITPL / Brookefield' },
  { label: 'Electronic City', value: 'Electronic City / Bommanahalli' },
  { label: 'Jayanagar / JP Nagar', value: 'Jayanagar / JP Nagar / Banashankari' },
  { label: 'MG Road / Shivajinagar', value: 'MG Road / Shivajinagar / Ulsoor' },
  { label: 'Hebbal / Thanisandra', value: 'Hebbal / Thanisandra / Bellary Road' },
  { label: 'Yeshwanthpur / Malleswaram', value: 'Yeshwanthpur / Rajajinagar / Malleswaram' },
  { label: 'Sarjapur / Bellandur', value: 'Sarjapur Road / Bellandur / Haralur' },
  { label: 'Bannerghatta Road', value: 'Bannerghatta Road / Arekere' },
  { label: 'Kengeri / Mysore Road', value: 'Kengeri / Mysore Road' },
  { label: 'RT Nagar / HBR Layout', value: 'RT Nagar / Nagawara / HBR Layout' },
  { label: 'Other', value: 'Other' }
]

function RideForm({ onRidePosted, userId }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [destination, setDestination] = useState('')
  const [gender, setGender] = useState('Prefer not to say')
  const [genderPref, setGenderPref] = useState('No preference')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const cleanPhone = phone.replace(/\s/g, '')
    if (!/^\d{10}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit phone number')
      return
    }
    setError('')
    setLoading(true)

    const time = new Date().toISOString()

    const docRef = await addDoc(collection(db, 'rides'), {
      userId, name, phone: cleanPhone, time, destination, gender, genderPref,
      createdAt: new Date().toISOString()
    })
    onRidePosted({ id: docRef.id, userId, name, phone: cleanPhone, time, destination, gender, genderPref })
    setLoading(false)
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit} style={{ all: 'unset', display: 'block' }}>
        <label>Your Name</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Priya" required />

        <label>Phone Number</label>
        <input
          value={phone}
          onChange={e => { setPhone(e.target.value); setError('') }}
          placeholder="e.g. 9876543210"
          type="tel"
          required
        />
        {error && <p className="error-text">{error}</p>}

        <label>Destination Area</label>
        <select value={destination} onChange={e => setDestination(e.target.value)} required>
          <option value="">Select your destination</option>
          {BANGALORE_AREAS.map(area => (
            <option key={area.value} value={area.value}>{area.label}</option>
          ))}
        </select>

        {/* Optional filters toggle */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          style={{
            marginTop: '1rem', background: 'none', border: 'none',
            color: '#5b6af0', fontSize: '0.85rem', fontWeight: 600,
            cursor: 'pointer', padding: 0, fontFamily: 'Segoe UI, sans-serif'
          }}
        >
          {showFilters ? '▲ Hide filters' : '▼ Add filters (optional)'}
        </button>

        {showFilters && (
          <>
            <label style={{ marginTop: '1rem' }}>Your Gender</label>
            <select value={gender} onChange={e => setGender(e.target.value)}>
              <option>Prefer not to say</option>
              <option>Male</option>
              <option>Female</option>
            </select>

            <label>Gender Preference</label>
            <select value={genderPref} onChange={e => setGenderPref(e.target.value)}>
              <option>No preference</option>
              <option>Male only</option>
              <option>Female only</option>
            </select>
          </>
        )}

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Finding matches...' : 'Find Carpool'}
        </button>
      </form>
    </div>
  )
}

export default RideForm