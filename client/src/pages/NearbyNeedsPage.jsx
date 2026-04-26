import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Share2, X, Trophy, Clock, Star } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../utils/rotaractData';
import { generateNearbyNeeds } from '../utils/nearbyGenerator';
import { useAuth } from '../context/AuthContext';

// Mappls API token
const MAPPLS_TOKEN = import.meta.env.VITE_MAPPLS_TOKEN || '815f64e8bd0a3b6a958b816da34bd291';

export default function NearbyNeedsPage() {
  const { recordVolunteerAction, userProfile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNeed, setSelectedNeed] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('requesting');
  const [locationName, setLocationName] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showList, setShowList] = useState(false);
  const [generatedNeeds, setGeneratedNeeds] = useState([]);
  const [volunteeredNeeds, setVolunteeredNeeds] = useState(new Set());
  const [volunteeringId, setVolunteeringId] = useState(null); // loading state for button
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Track needs user has already volunteered for (from profile history)
  useEffect(() => {
    if (userProfile?.volunteerHistory) {
      const ids = new Set(userProfile.volunteerHistory.map(h => h.needId));
      setVolunteeredNeeds(ids);
    }
  }, [userProfile?.volunteerHistory]);

  // ===== GPS: Always request user's real location =====
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }

    setLocationStatus('requesting');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setLocationStatus('granted');
        setGeneratedNeeds(generateNearbyNeeds(loc.lat, loc.lng));
        reverseGeocode(loc.lat, loc.lng);
      },
      (err) => {
        console.warn('Geolocation denied:', err.message);
        setLocationStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  // Reverse geocode using free Nominatim API
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`);
      const data = await res.json();
      const addr = data.address;
      const name = addr.city || addr.town || addr.village || addr.suburb || addr.county || addr.state || 'Your Area';
      setLocationName(name);
    } catch {
      setLocationName('Your Area');
    }
  };

  // Manual location retry
  const retryLocation = () => {
    setLocationStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setLocationStatus('granted');
        setGeneratedNeeds(generateNearbyNeeds(loc.lat, loc.lng));
        reverseGeocode(loc.lat, loc.lng);
      },
      () => setLocationStatus('denied'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Filter & sort needs by distance from user
  const filteredNeeds = useMemo(() => {
    if (!userLocation) return [];
    let needs = generatedNeeds.filter(n => new Date(n.expiresAt) > new Date());
    if (selectedCategory !== 'all') needs = needs.filter(n => n.category === selectedCategory);
    needs = needs.map(n => ({ ...n, _dist: calcDistanceRaw(n, userLocation) }));
    needs.sort((a, b) => {
      if (a.urgency === 'critical' && b.urgency !== 'critical') return -1;
      if (b.urgency === 'critical' && a.urgency !== 'critical') return 1;
      return a._dist - b._dist;
    });
    return needs;
  }, [selectedCategory, generatedNeeds, userLocation]);

  // Load Mappls SDK
  useEffect(() => {
    if (document.getElementById('mappls-sdk')) {
      if (window.mappls) setMapLoaded(true);
      return;
    }
    if (MAPPLS_TOKEN === 'YOUR_MAPPLS_TOKEN') return;
    const script = document.createElement('script');
    script.id = 'mappls-sdk';
    script.src = `https://apis.mappls.com/advancedmaps/api/815f64e8bd0a3b6a958b816da34bd291/map_sdk?v=3.0&layer=vector`;
    script.async = true;
    script.onload = () => setMapLoaded(true);
    script.onerror = () => console.warn('Mappls SDK failed to load');
    document.head.appendChild(script);
  }, []);

  // Initialize map when location is ready
  useEffect(() => {
    if (!mapLoaded || !window.mappls || !mapRef.current || !userLocation || mapInstanceRef.current) return;
    try {
      mapInstanceRef.current = new window.mappls.Map(mapRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 13,
        zoomControl: true,
        location: true,
      });
      mapInstanceRef.current.addListener('load', () => addMarkers());
    } catch (e) {
      console.warn('Map init error:', e);
    }
  }, [mapLoaded, userLocation]);

  useEffect(() => {
    if (mapInstanceRef.current) addMarkers();
  }, [filteredNeeds]);

  function addMarkers() {
    const map = mapInstanceRef.current;
    if (!map) return;
    markersRef.current.forEach(m => { try { map.removeLayer(m); } catch (e) { } });
    markersRef.current = [];
    filteredNeeds.forEach(need => {
      const cat = SERVICE_CATEGORIES.find(c => c.id === need.category);
      try {
        const marker = new window.mappls.Marker({
          map, position: { lat: need.location.lat, lng: need.location.lng },
          popupHtml: `<div style="padding:8px;max-width:200px;">
            <strong>${cat?.icon || '📍'} ${need.title}</strong><br/>
            <small style="color:#666">${need.location.address}</small><br/>
            <span style="color:${need.urgency === 'critical' ? '#EF4444' : need.urgency === 'high' ? '#F59E0B' : '#10B981'};font-weight:600;font-size:12px;">${need.urgency.toUpperCase()}</span>
          </div>`,
        });
        markersRef.current.push(marker);
      } catch (e) { }
    });
  }

  const getCatInfo = (id) => SERVICE_CATEGORIES.find(c => c.id === id);
  const getUrgencyClass = (u) => u === 'critical' ? 'danger' : u === 'high' ? 'warning' : u === 'medium' ? 'primary' : 'success';

  function calcDistanceRaw(need, loc) {
    const R = 6371;
    const dLat = ((need.location.lat - loc.lat) * Math.PI) / 180;
    const dLon = ((need.location.lng - loc.lng) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(loc.lat * Math.PI / 180) * Math.cos(need.location.lat * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  const formatDist = (need) => {
    if (!userLocation) return '—';
    const d = calcDistanceRaw(need, userLocation);
    return d < 1 ? `${Math.round(d * 1000)}m` : `${d.toFixed(1)} km`;
  };

  // ===== VOLUNTEER NOW HANDLER =====
  const handleVolunteer = async (e, need) => {
    e.stopPropagation();
    if (volunteeredNeeds.has(need.id)) return; // already volunteered

    setVolunteeringId(need.id);
    const cat = getCatInfo(need.category);

    // Determine hours estimate based on need type
    const hoursEstimate = need.category === 'blood_donation' ? 2
      : need.category === 'health_camp' ? 4
        : need.category === 'tree_plantation' ? 3
          : need.category === 'food_drive' ? 3
            : need.category === 'cleanliness' ? 4
              : need.category === 'disaster_relief' ? 6
                : need.category === 'education' ? 3
                  : 2;

    const pointsEarned = need.urgency === 'critical' ? 50
      : need.urgency === 'high' ? 30
        : need.urgency === 'medium' ? 20
          : 10;

    try {
      await recordVolunteerAction({
        needId: need.id,
        title: need.title,
        category: need.category,
        hours: hoursEstimate,
        points: pointsEarned,
        beneficiaries: need.volunteersNeeded || 0,
        count: 1,
      });
    } catch (err) {
      console.error('Volunteer failure:', err);
      alert(`Could not record your action: ${err.message}`);
      return; // Stop here if it failed
    }

    setVolunteeredNeeds(prev => new Set([...prev, need.id]));
    setSuccessData({
      title: need.title,
      hours: hoursEstimate,
      points: pointsEarned,
      icon: cat?.icon
    });
    setShowSuccess(true);
    setVolunteeringId(null);
  };


  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'I just volunteered on SevaSync!',
        text: `I'm contributing ${successData?.hours} hours to "${successData?.title}". Join me in making a difference!`,
        url: window.location.href,
      }).catch(console.error);
    }
  };

  // ===== LOCATION REQUESTING STATE =====
  if (locationStatus === 'requesting') {
    return (
      <div className="page animate-fade">
        <div className="empty-state" style={{ minHeight: '60vh' }}>
          <div className="location-pulse-ring">
            <div className="location-pulse-dot" />
          </div>
          <div className="empty-title">Detecting your location...</div>
          <div className="empty-text">Please allow location access so we can find needs near you</div>
          <div className="spinner" style={{ marginTop: 16 }} />
        </div>
      </div>
    );
  }

  // ===== LOCATION DENIED STATE =====
  if (locationStatus === 'denied' || !userLocation) {
    return (
      <div className="page animate-fade">
        <div className="page-header">
          <h1 style={{ fontSize: '1.5rem' }}>📍 Nearby Needs</h1>
        </div>
        <div className="empty-state" style={{ minHeight: '50vh' }}>
          <div style={{ fontSize: '4rem' }}>📍</div>
          <div className="empty-title">Location access needed</div>
          <div className="empty-text">
            We need your GPS location to find nearby blood donation camps, health drives, and volunteer opportunities around you.
          </div>
          <button className="btn btn-primary" onClick={retryLocation} id="retry-location" style={{ marginTop: 16 }}>
            📍 Enable Location
          </button>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 12, maxWidth: 280 }}>
            Tip: Check your browser settings → Site permissions → Location, and allow for this site.
          </p>
        </div>
      </div>
    );
  }

  // ===== MAIN VIEW (location granted) =====
  return (
    <div className="page animate-fade" style={{ paddingBottom: 90 }}>
      <div className="page-header">
        <h1 style={{ fontSize: '1.5rem' }}>📍 Nearby Needs</h1>
        <button className={`btn btn-sm ${showList ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setShowList(!showList)} id="toggle-view">
          {showList ? '🗺️ Map' : '📋 List'}
        </button>
      </div>

      {/* Location indicator */}
      <div className="location-indicator">
        <div className="location-dot-live" />
        <span>📍 {locationName || 'Your Location'}</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
        </span>
      </div>

      {/* Category Filter */}
      <div className="filter-chips">
        <button className={`chip ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}>🌐 All</button>
        {SERVICE_CATEGORIES.map(cat => (
          <button key={cat.id} className={`chip ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)} id={`cat-${cat.id}`}>
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Map View */}
      {!showList && (
        <div className="map-container">
          <div ref={mapRef} id="mappls-map" className="mappls-map" />
          {!mapLoaded && (
            <div className="map-placeholder">
              <div className="map-placeholder-inner">
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>🗺️</div>
                <h3>Map</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: 280, margin: '8px auto 0' }}>
                  {MAPPLS_TOKEN === 'YOUR_MAPPLS_TOKEN'
                    ? 'Add your Mappls API token in .env to enable the interactive map.'
                    : 'Connecting to Mappls...'}
                </p>
                <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }}
                  onClick={() => setShowList(true)}>View as List</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Urgent Banner */}
      {filteredNeeds.some(n => n.urgency === 'critical') && (
        <div className="urgent-banner animate-fade">
          <div className="urgent-pulse" />
          <span>🚨 Critical needs near you require immediate attention!</span>
        </div>
      )}

      {/* Needs Count */}
      <div className="flex justify-between items-center" style={{ margin: '16px 0 12px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {filteredNeeds.length} active need{filteredNeeds.length !== 1 ? 's' : ''} near you
        </span>
      </div>

      {/* Needs List */}
      <div className="flex flex-col gap-md">
        {filteredNeeds.map((need, i) => {
          const cat = getCatInfo(need.category);
          const dist = formatDist(need);
          const spotsLeft = need.volunteersNeeded - need.volunteersJoined;
          const fillPct = Math.round((need.volunteersJoined / need.volunteersNeeded) * 100);
          const alreadyVolunteered = volunteeredNeeds.has(need.id);
          const isVolunteering = volunteeringId === need.id;

          return (
            <div key={need.id} className={`need-card ${selectedNeed === need.id ? 'need-card-expanded' : ''}`}
              onClick={() => setSelectedNeed(selectedNeed === need.id ? null : need.id)}
              style={{ animationDelay: `${i * 0.06}s`, borderLeftColor: cat?.color || 'var(--primary)' }}>

              <div className="flex justify-between items-center" style={{ marginBottom: 8 }}>
                <div className="flex items-center gap-sm">
                  <span style={{ fontSize: '1.4rem' }}>{cat?.icon}</span>
                  <span className={`badge badge-${getUrgencyClass(need.urgency)}`}>
                    {need.urgency === 'critical' ? '🔴' : ''} {need.urgency}
                  </span>
                </div>
                <span className="distance-badge">{dist}</span>
              </div>

              <div className="need-title">{need.title}</div>
              <div className="need-address">📍 {need.location.address}</div>

              {need.bloodGroup && <span className="blood-badge">{need.bloodGroup}</span>}

              <div style={{ margin: '12px 0 8px' }}>
                <div className="flex justify-between" style={{ fontSize: '0.75rem', marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {alreadyVolunteered ? need.volunteersJoined + 1 : need.volunteersJoined}/{need.volunteersNeeded} volunteers
                  </span>
                  <span style={{ fontWeight: 600, color: spotsLeft <= 2 ? 'var(--danger)' : 'var(--accent)' }}>
                    {alreadyVolunteered ? Math.max(spotsLeft - 1, 0) : spotsLeft} spots left
                  </span>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{
                    width: `${alreadyVolunteered ? Math.min(fillPct + (100 / need.volunteersNeeded), 100) : fillPct}%`
                  }} />
                </div>
              </div>

              {selectedNeed === need.id && (
                <div className="need-details animate-fade">
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '12px 0' }}>
                    {need.description}
                  </p>
                  <div className="need-meta-grid">
                    <div className="need-meta-item">
                      <span className="need-meta-label">Posted by</span>
                      <span className="need-meta-value">{need.postedBy}</span>
                    </div>
                    {need.date && (
                      <div className="need-meta-item">
                        <span className="need-meta-label">Date</span>
                        <span className="need-meta-value">📅 {need.date}</span>
                      </div>
                    )}
                    {need.phone && (
                      <div className="need-meta-item">
                        <span className="need-meta-label">Contact</span>
                        <span className="need-meta-value">
                          <a href={`tel:${need.phone}`} onClick={e => e.stopPropagation()}
                            style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                            📞 {need.phone}
                          </a>
                        </span>
                      </div>
                    )}
                    <div className="need-meta-item">
                      <span className="need-meta-label">Distance</span>
                      <span className="need-meta-value">🚶 {dist} from you</span>
                    </div>
                  </div>
                  <div className="flex gap-sm" style={{ marginTop: 14 }}>
                    {alreadyVolunteered ? (
                      <button className="btn btn-success" style={{ flex: 1, opacity: 0.9 }} disabled>
                        ✅ Volunteered
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        style={{ flex: 1 }}
                        disabled={isVolunteering}
                        onClick={(e) => handleVolunteer(e, need)}
                        id={`volunteer-${need.id}`}
                      >
                        {isVolunteering
                          ? <span className="spinner" style={{ width: 16, height: 16 }} />
                          : '🙋 Volunteer Now'}
                      </button>
                    )}
                    <button className="btn btn-secondary" style={{ flex: 1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${need.location.lat},${need.location.lng}`, '_blank');
                      }}>
                      🧭 Directions
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredNeeds.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            <div className="empty-title">No active needs in this category</div>
            <div className="empty-text">Check back later or try a different filter</div>
          </div>
        )}
      </div>

      {/* Success Celebration Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="success-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Particles simulation */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="particle"
                initial={{
                  x: "50vw",
                  y: "50vh",
                  scale: 0,
                  opacity: 1
                }}
                animate={{
                  x: `${Math.random() * 100}vw`,
                  y: `${Math.random() * 100}vh`,
                  scale: Math.random() * 1.5,
                  opacity: 0
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{
                  background: i % 2 === 0 ? 'var(--primary)' : 'var(--accent)',
                  width: 10, height: 10, borderRadius: '50%',
                  position: 'fixed', zIndex: 9998
                }}
              />
            ))}

            <motion.div
              className="success-modal card"
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <button className="close-btn" onClick={() => setShowSuccess(false)}>
                <X size={20} />
              </button>

              <div className="success-icon-container">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <CheckCircle2 size={64} className="success-check-icon" />
                </motion.div>
              </div>

              <h2 className="success-title">Awesome Job!</h2>
              <p className="success-subtitle">You just volunteered for:</p>
              <div className="success-project-name">
                {successData?.icon} {successData?.title}
              </div>

              <div className="reward-summary">
                <div className="reward-item">
                  <div className="reward-icon"><Star size={18} /></div>
                  <div className="reward-label">Points Earned</div>
                  <div className="reward-value">+{successData?.points}</div>
                </div>
                <div className="reward-item">
                  <div className="reward-icon"><Clock size={18} /></div>
                  <div className="reward-label">Hours Logged</div>
                  <div className="reward-value">+{successData?.hours}h</div>
                </div>
                <div className="reward-item">
                  <div className="reward-icon"><Trophy size={18} /></div>
                  <div className="reward-label">Impact Level</div>
                  <div className="reward-value">Rising Star</div>
                </div>
              </div>

              <div className="success-actions">
                <button className="btn btn-primary w-full" onClick={handleShare}>
                  <Share2 size={18} /> Share Impact
                </button>
                <button className="btn btn-secondary w-full" onClick={() => setShowSuccess(false)}>
                  ⬅️ Back
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .success-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 14, 23, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 9999;
        }
        .success-modal {
          max-width: 400px;
          width: 100%;
          text-align: center;
          position: relative;
          background: var(--bg-card);
          border: 1px solid var(--border);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          padding: 32px 24px;
        }
        .close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          color: var(--text-muted);
          padding: 4px;
        }
        .success-icon-container {
          margin-bottom: 20px;
          display: flex;
          justify-content: center;
        }
        .success-check-icon {
          color: var(--success);
          filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.3));
        }
        .success-title {
          font-size: 1.8rem;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #fff, #a0a0b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .success-subtitle {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 4px;
        }
        .success-project-name {
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--primary-light);
          margin-bottom: 24px;
        }
        .reward-summary {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 32px;
        }
        .reward-item {
          background: var(--bg-elevated);
          padding: 12px 8px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
        }
        .reward-icon {
          color: var(--accent);
          margin-bottom: 6px;
          display: flex;
          justify-content: center;
        }
        .reward-label {
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .reward-value {
          font-weight: 800;
          font-size: 1.1rem;
          color: #fff;
        }
        .success-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
      `}</style>
    </div>
  );
}
