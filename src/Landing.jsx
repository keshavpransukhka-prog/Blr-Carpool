function Landing() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: 'white', color: '#0f0f14', overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.1rem 2rem',
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e8eaf2'
      }}>
        <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1.1rem' }}>✈️ BLR Carpool</span>
        <a href="/app" style={{
          background: '#5b6af0', color: 'white',
          padding: '0.55rem 1.25rem', borderRadius: '100px',
          fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
          fontFamily: 'Sora, sans-serif'
        }}>Find a Carpool →</a>
      </nav>

      {/* HERO */}
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        padding: '7rem 1.5rem 4rem',
        background: 'linear-gradient(160deg, #f5f6fa 0%, #eef0fe 50%, #f5f6fa 100%)'
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: '#eef0fe', color: '#5b6af0',
          padding: '0.4rem 1rem', borderRadius: '100px',
          fontSize: '0.8rem', fontWeight: 600,
          fontFamily: 'Sora, sans-serif', marginBottom: '1.5rem',
          letterSpacing: '0.04em', textTransform: 'uppercase'
        }}>✈️ Bangalore Airport</div>

        <h1 style={{
          fontFamily: 'Sora, sans-serif', fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
          fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem', maxWidth: '700px'
        }}>
          Share the ride.<br /><span style={{ color: '#5b6af0' }}>Split the cost.</span>
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', color: '#888',
          maxWidth: '480px', lineHeight: 1.7, marginBottom: '2.5rem', fontWeight: 300
        }}>
          BLR Carpool connects you with fellow passengers landing at Kempegowda International Airport heading the same way.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="/app" style={{
            background: '#5b6af0', color: 'white',
            padding: '0.85rem 2rem', borderRadius: '100px',
            fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none',
            fontFamily: 'Sora, sans-serif',
            boxShadow: '0 4px 20px rgba(91,106,240,0.3)'
          }}>Find a Carpool →</a>
          <a href="#how-it-works" style={{
            background: 'white', color: '#0f0f14',
            padding: '0.85rem 2rem', borderRadius: '100px',
            fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none',
            fontFamily: 'Sora, sans-serif', border: '1.5px solid #e8eaf2'
          }}>How it works</a>
        </div>

        <div style={{ display: 'flex', gap: '2.5rem', marginTop: '4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[['₹0', 'Cost to use'], ['±1hr', 'Match window'], ['50%', 'Avg. savings']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.8rem', fontWeight: 800, color: '#5b6af0' }}>{num}</div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.2rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* WHAT IS CARPOOLING */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#5b6af0', marginBottom: '0.75rem' }}>The basics</p>
        <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, marginBottom: '1rem' }}>What is carpooling?</h2>
        <p style={{ color: '#888', lineHeight: 1.7, maxWidth: '560px', fontWeight: 300, marginBottom: '2.5rem' }}>
          Carpooling means sharing a cab with strangers going the same direction — splitting the cost equally. A cab from BLR to Indiranagar costs ₹800–1200. Split two ways, that's ₹400–600 each.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {[
            ['💸', 'Save money', 'Split the fare equally with your co-passenger. The more people, the cheaper it gets.'],
            ['🌱', 'Better for everyone', 'Fewer cabs on the road means less traffic and a smaller carbon footprint.'],
            ['🤝', 'Meet fellow travellers', 'Most BLR arrivals are professionals and frequent flyers — good company for the ride.']
          ].map(([icon, title, desc]) => (
            <div key={title} style={{
              background: '#f5f6fa', borderRadius: '16px', padding: '1.5rem',
              border: '1px solid #e8eaf2'
            }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{icon}</div>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.4rem' }}>{title}</h3>
              <p style={{ fontSize: '0.88rem', color: '#888', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '5rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#5b6af0', marginBottom: '0.75rem' }}>Step by step</p>
        <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, marginBottom: '1rem' }}>How does BLR Carpool work?</h2>
        <div style={{ background: '#f5f6fa', borderRadius: '24px', padding: '2.5rem 2rem', marginTop: '1.5rem' }}>
          {[
            ['Fill in your details', 'Enter your name, phone number, arrival time, and destination. Your phone number stays private until you match.'],
            ['See who\'s arriving near you', 'We show passengers arriving within 1 hour of you, going to the same part of the city.'],
            ['Send a carpool request', 'Tap "Request Carpool" on someone you\'d like to share with.'],
            ['Wait for them to accept', 'If they request you back, it\'s a mutual match. You\'ll both get a browser notification.'],
            ['Connect on WhatsApp', 'Once matched, phone numbers are revealed and a WhatsApp button appears.']
          ].map(([title, desc], i) => (
            <div key={title} style={{ display: 'flex', gap: '1.25rem', paddingBottom: i < 4 ? '2rem' : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: '#5b6af0', color: 'white',
                  fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '0.85rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{i + 1}</div>
                {i < 4 && <div style={{ width: '2px', flex: 1, background: '#e8eaf2', marginTop: '0.5rem', minHeight: '30px' }} />}
              </div>
              <div style={{ paddingTop: '0.4rem' }}>
                <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.3rem' }}>{title}</h3>
                <p style={{ fontSize: '0.88rem', color: '#888', lineHeight: 1.6 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SAFETY */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#5b6af0', marginBottom: '0.75rem' }}>Safety first</p>
        <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, marginBottom: '1rem' }}>How to stay safe</h2>
        <div style={{
          background: '#fffbeb', borderRadius: '24px', padding: '2.5rem 2rem',
          border: '1.5px solid #fde68a'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {[
              ['Meet in public', 'Always meet in the public Arrivals area, not a secluded spot.'],
              ['Check their ID', 'Ask to see an Aadhar card, passport, or driver\'s licence before sharing.'],
              ['Share your location', 'Drop a live location to a trusted contact before getting in.'],
              ['Trust your instincts', 'If something feels off, it\'s completely fine to decline and book separately.'],
              ['Use official cabs only', 'Only use Uber, Ola, or the airport\'s official prepaid taxi counter.'],
              ['Agree on fare upfront', 'Confirm how you\'ll split the fare before the ride starts.']
            ].map(([title, desc]) => (
              <div key={title} style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#92400e', marginTop: '0.4rem', flexShrink: 0 }} />
                <div>
                  <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: '#78350f', marginBottom: '0.15rem' }}>{title}</p>
                  <p style={{ fontSize: '0.85rem', color: '#92400e', lineHeight: 1.5 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#5b6af0', marginBottom: '0.75rem' }}>FAQ</p>
        <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, marginBottom: '2rem' }}>Common questions</h2>
        {[
          ['Is BLR Carpool free to use?', 'Yes, completely free. We don\'t charge anything. You split the cab fare directly with your co-passenger.'],
          ['Is my phone number visible to everyone?', 'No. Your phone number is only revealed when there is a mutual match — both of you have requested each other.'],
          ['What if my flight is delayed?', 'Update your arrival time after landing. We match based on the time you enter.'],
          ['Can I request multiple people?', 'Yes! You can send requests to multiple people at the same time.'],
          ['How long does my listing stay up?', 'Your listing is automatically hidden after 24 hours.'],
          ['What if I can\'t find a match?', 'Tap "Expand Search" to widen the match window to ±3 hours and remove destination filters.']
        ].map(([q, a]) => (
          <details key={q} style={{ borderBottom: '1px solid #e8eaf2', padding: '1rem 0' }}>
            <summary style={{
              fontFamily: 'Sora, sans-serif', fontSize: '0.9rem', fontWeight: 600,
              cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between'
            }}>
              {q} <span>▼</span>
            </summary>
            <p style={{ fontSize: '0.88rem', color: '#888', lineHeight: 1.6, marginTop: '0.75rem' }}>{a}</p>
          </details>
        ))}
      </section>

      {/* CTA */}
      <div style={{
        background: '#0f0f14', color: 'white',
        textAlign: 'center', padding: '5rem 1.5rem'
      }}>
        <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, marginBottom: '1rem' }}>
          Ready to save on your next cab?
        </h2>
        <p style={{ color: '#aaa', fontSize: '1rem', marginBottom: '2rem', fontWeight: 300 }}>
          Takes less than 2 minutes. Free forever.
        </p>
        <a href="/app" style={{
          background: '#5b6af0', color: 'white',
          padding: '0.9rem 2.5rem', borderRadius: '100px',
          fontSize: '1rem', fontWeight: 600, textDecoration: 'none',
          fontFamily: 'Sora, sans-serif', display: 'inline-block',
          boxShadow: '0 4px 20px rgba(91,106,240,0.4)'
        }}>Find a Carpool →</a>
      </div>

      <footer style={{
        background: '#0f0f14', borderTop: '1px solid #222',
        padding: '1.5rem', textAlign: 'center', color: '#555', fontSize: '0.8rem'
      }}>
        Built with ❤️ for BLR travellers · Free to use · Your data is deleted after 24 hours
      </footer>

      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />
    </div>
  )
}

export default Landing