import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../client';
import { DRAGON_CLASS_INFO } from '../constants/dragonClasses';

function DragonsList() {
  const [dragons, setDragons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDragons();
  }, []);

  const fetchDragons = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('Dragons')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;
      setDragons(data || []);
    } catch (err) {
      setError('Failed to load dragons. Please try again.');
      console.error('Error fetching dragons:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading dragons...</h2>
        <p>Summoning your dragon roster...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div className="error">{error}</div>
        <button onClick={fetchDragons} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Dragon Roster</h1>
        <Link to="/dragons/new" className="btn btn-primary">
          + Recruit New Dragon
        </Link>
      </div>

      {dragons.length === 0 ? (
        <div className="empty-state">
          <h3>No Dragons Recruited Yet</h3>
          <p>Your dragon roster is empty. Start recruiting dragons to defend Berk!</p>
          <Link to="/dragons/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Recruit First Dragon
          </Link>
        </div>
      ) : (
        <div className="dragons-grid">
          {dragons.map((dragon) => {
            const classInfo = DRAGON_CLASS_INFO[dragon.dragonClass] || { label: 'Unknown', color: '' };
            return (
              <Link
                key={dragon.id}
                to={`/dragons/${dragon.id}`}
                className={`dragon-card ${classInfo.color}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <span className={`dragon-class-badge ${classInfo.color}`}>
                  {classInfo.label}
                </span>
                {dragon.imageURL && (
                  <img
                    src={dragon.imageURL}
                    alt={dragon.dragonClass}
                    className="dragon-card-image"
                  />
                )}
                <h3>{dragon.name}</h3>
                <div className="dragon-meta">
                  {dragon.weight && (
                    <div className="stat">
                      <span>Weight: {dragon.weight} kg</span>
                    </div>
                  )}
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text)' }}>
                    Recruited: {formatDate(dragon.created_at)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DragonsList;
