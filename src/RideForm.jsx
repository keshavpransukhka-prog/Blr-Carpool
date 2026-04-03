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
  const [error, setError] = useState('')

  function toggleLocation(area) {
    setLocationPrefs(prev =>
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const cleanPhone = phone.replace(/\s/g, '')
    if (!/^\d{10}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit phone number')
      return
    }
    setError('')
    const docRef = await addDoc(collection(db, 'rides'), {
      name, phone: cleanPhone, time, destination, gender, genderPref,
      locationPrefs, createdAt: new Date().toISOString()
    })
    onRidePosted({ id: docRef.id, name, phone: cleanPhone, time, destination, gender, genderPref, locationPrefs })
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

        <label>Gender Preference</label>
        <select value={genderPref} onChange={e => setGenderPref(e.target.value)}>
          <option>No preference</option>
          <option>Male only</option>
          <option>Female only</option>
        </select>

        <label>Location Preference</label>
        <div className="checkbox-list">
          {BANGALORE_AREAS.map(area => (
            <label key={area}>
              <input
                type="checkbox"
                checked={locationPrefs.includes(area)}
                onChange={() => toggleLocation(area)}
              />
              {area}
            </label>
          ))}
        </div>

        <button type="submit" className="btn-primary">Find Carpool</button>
      </form>
    </div>
  )
}

export default RideForm