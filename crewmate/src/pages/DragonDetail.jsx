import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../client';
import { DRAGON_CLASS_INFO, CLASS_TRAITS } from '../constants/dragonClasses';

function DragonDetail() {
  const { id } = useParams();
  const [dragon, setDragon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDragon();
  }, [id]);

  const fetchDragon = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('Dragons')
        .select('*')
        .eq('id', id)
        .single();

      if (supabaseError) throw supabaseError;
      if (!data) throw new Error('Dragon not found');
      setDragon(data);
    } catch (err) {
      setError('Failed to load dragon details.');
      console.error('Error fetching dragon:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Summoning dragon details...</h2>
      </div>
    );
  }

  if (error || !dragon) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div className="error">{error || 'Dragon not found'}</div>
        <Link to="/dragons" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Roster
        </Link>
      </div>
    );
  }

  const classInfo = DRAGON_CLASS_INFO[dragon.dragonClass] || { label: 'Unknown', color: '', description: 'Unknown class' };
  const traits = CLASS_TRAITS[dragon.dragonClass] || [];

  return (
    <div className="dragon-detail">
      <div className={`dragon-detail-header ${classInfo.color}`}>
        <span className={`dragon-class-badge ${classInfo.color}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
          {classInfo.label}
        </span>
        <h2>{dragon.name}</h2>
        {dragon.imageURL && (
          <img
            src={dragon.imageURL}
            alt={dragon.dragonClass}
            className="dragon-detail-image"
          />
        )}
        <p className="class-description" style={{ marginTop: '0.5rem', fontSize: '1rem' }}>
          {classInfo.description}
        </p>
      </div>

      <div className="dragon-info">
        <div className="dragon-info-row">
          <span className="dragon-info-label">Dragon Name</span>
          <span className="dragon-info-value">{dragon.name}</span>
        </div>
        <div className="dragon-info-row">
          <span className="dragon-info-label">Weight</span>
          <span className="dragon-info-value">{dragon.weight ? `${dragon.weight} kg` : 'Not recorded'}</span>
        </div>
        <div className="dragon-info-row">
          <span className="dragon-info-label">Dragon Class</span>
          <span className="dragon-info-value">{classInfo.label}</span>
        </div>
        <div className="dragon-info-row">
          <span className="dragon-info-label">Recruited On</span>
          <span className="dragon-info-value">{formatDate(dragon.created_at)}</span>
        </div>
        <div className="dragon-info-row">
          <span className="dragon-info-label">Dragon ID</span>
          <span className="dragon-info-value" style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>
            {dragon.id}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
          Special Traits
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0 0' }}>
          {traits.map((trait, index) => (
            <li key={index} style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🔥</span>
              {trait}
            </li>
          ))}
        </ul>
      </div>

      <div className="form-actions">
        <Link to="/dragons" className="btn btn-outline">
          Back to Roster
        </Link>
        <Link to={`/dragons/${dragon.id}/edit`} className="btn btn-secondary">
          Edit Dragon
        </Link>
      </div>
    </div>
  );
}

export default DragonDetail;
