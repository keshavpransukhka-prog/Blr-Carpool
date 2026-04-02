import { useState } from 'react'
import { db } from './firebase'
import { collection, addDoc } from 'firebase/firestore'

const BANGALORE_AREAS = [
  'Indiranagar / Jeevan Bima Nagar / Kadubeesanahalli / Marathahalli',
  'Koramangala / BTM Layout / HSR Layout',
  'Whitefield / ITPL / Brookefield',
  'Electronic City / Bommanahalli',
  'Jayanagar / JP Nagar / Banashankari',
  'MG Road / Shivajinagar / Ulsoor',
  'Hebbal / Thanisandra / Bellary Road',
  'Yeshwanthpur / Rajajinagar / Malleswaram',
  'Sarjapur Road / Bellandur / Haralur',
  'Bannerghatta Road / Arekere',
  'Kengeri / Mysore Road',
  'RT Nagar / Nagawara / HBR Layout',
  'Other'
]

function RideForm({ onRidePosted }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [time, setTime] = useState('')
  const [destination, setDestination] = useState('')
  const [gender, setGender] = useState('Prefer not to say')
  const [genderPref, setGenderPref] = useState('No preference')
  const [locationPrefs, setLocationPrefs] = useState([])
  const [submitted, setSubmitted] = useState(false)

  function toggleLocation(area) {
    setLocationPrefs(prev =>
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const docRef = await addDoc(collection(db, 'rides'), {
      name, phone, time, destination, gender, genderPref,
      locationPrefs,
      createdAt: new Date().toISOString()
    })

    onRidePosted({ id: docRef.id, name, phone, time, destination, gender, genderPref, locationPrefs })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        marginBottom: '1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
        <p style={{ fontWeight: '600', color: '#1a1a2e', fontSize: '1rem' }}>Your details have been collected!</p>
        <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.3rem' }}>We'll show you matches arriving within 1 hour of you.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Your Name</label>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Priya" required />

      <label>Phone Number</label>
      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 98765 43210" type="tel" required />

      <label>Arrival Time</label>
      <input type="datetime-local" value={time} onChange={e => setTime(e.target.value)} required />

      <label>Destination Area</label>
      <select value={destination} onChange={e => setDestination(e.target.value)} required>
        <option value="">Select your destination</option>
        {BANGALORE_AREAS.map(area => (
          <option key={area} value={area}>{area}</option>
        ))}
      </select>

      <label>Your Gender</label>
      <select value={gender} onChange={e => setGender(e.target.value)}>
        <option>Prefer not to say</option>
        <option>Male</option>
        <option>Female</option>
      </select>

      <label>Gender Preference for Carpool</label>
      <select value={genderPref} onChange={e => setGenderPref(e.target.value)}>
        <option>No preference</option>
        <option>Male only</option>
        <option>Female only</option>
      </select>

      <label>Location Preference (select all that work for you)</label>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        marginTop: '0.3rem',
        maxHeight: '200px',
        overflowY: 'auto',
        padding: '0.75rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        background: '#fafafa'
      }}>
        {BANGALORE_AREAS.map(area => (
          <label key={area} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '400',
            fontSize: '0.9rem',
            cursor: 'pointer',
            marginTop: '0'
          }}>
            <input
              type="checkbox"
              checked={locationPrefs.includes(area)}
              onChange={() => toggleLocation(area)}
              style={{ width: 'auto', cursor: 'pointer' }}
            />
            {area}
          </label>
        ))}
      </div>

      <button type="submit">Find Carpool</button>
    </form>
  )
}

export default RideForm