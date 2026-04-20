import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import { DRAGON_CLASSES, DRAGON_CLASS_INFO, getDragonClassImage } from '../constants/dragonClasses';

function EditDragon() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    weight: '',
    dragonClass: '',
  });
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

      setOriginalData(data);
      setFormData({
        name: data.name || '',
        weight: data.weight || '',
        dragonClass: data.dragonClass || '',
      });
    } catch (err) {
      setError('Failed to load dragon details.');
      console.error('Error fetching dragon:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!formData.name.trim() || !formData.dragonClass) {
      setError('Please fill in all required fields');
      setSaving(false);
      return;
    }

    try {
      const imageURL = getDragonClassImage(formData.dragonClass);

      const { error: supabaseError } = await supabase
        .from('Dragons')
        .update({
          name: formData.name.trim(),
          weight: formData.weight ? parseFloat(formData.weight) : null,
          dragonClass: formData.dragonClass,
          imageURL: imageURL,
        })
        .eq('id', id);

      if (supabaseError) throw supabaseError;

      navigate(`/dragons/${id}`);
    } catch (err) {
      setError('Failed to update dragon. Please try again.');
      console.error('Error updating dragon:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      const { error: supabaseError } = await supabase
        .from('Dragons')
        .delete()
        .eq('id', id);

      if (supabaseError) throw supabaseError;

      navigate('/dragons');
    } catch (err) {
      setError('Failed to delete dragon. Please try again.');
      console.error('Error deleting dragon:', err);
      setSaving(false);
    }
  };

  const currentImageURL = formData.dragonClass ? getDragonClassImage(formData.dragonClass) : originalData?.imageURL;

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading dragon details...</h2>
      </div>
    );
  }

  if (error && !originalData) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div className="error">{error}</div>
        <button onClick={() => navigate('/dragons')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Roster
        </button>
      </div>
    );
  }

  const classInfo = DRAGON_CLASS_INFO[formData.dragonClass] || DRAGON_CLASS_INFO[originalData?.dragonClass] || { label: 'Unknown', color: '' };

  return (
    <div className="form-container">
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        Edit Dragon
      </h2>

      {error && <div className="error">{error}</div>}

      {currentImageURL && (
        <img
          src={currentImageURL}
          alt={formData.dragonClass || originalData?.dragonClass}
          className="dragon-detail-image"
          style={{ height: '120px', margin: '0 auto 1rem' }}
        />
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Dragon Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Toothless, Stormfly"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="weight">Weight (kg)</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="e.g., 1770"
            min="0"
            step="0.1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dragonClass">Dragon Class *</label>
          <select
            id="dragonClass"
            name="dragonClass"
            value={formData.dragonClass}
            onChange={handleChange}
            required
          >
            <option value="">Select a class...</option>
            {DRAGON_CLASSES.map((cls) => (
              <option key={cls.value} value={cls.value}>
                {cls.label}
              </option>
            ))}
          </select>
          {formData.dragonClass && (
            <p className="class-description">
              {DRAGON_CLASSES.find(c => c.value === formData.dragonClass)?.description}
            </p>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate(`/dragons/${id}`)}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <h3 style={{ color: '#dc2626', textAlign: 'center', marginBottom: '1rem' }}>
            Danger Zone
          </h3>
          {!showDeleteConfirm ? (
            <button
              type="button"
              className="btn btn-danger"
              style={{ width: '100%' }}
              onClick={() => setShowDeleteConfirm(true)}
            >
              Release Dragon (Delete)
            </button>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ marginBottom: '1rem', color: '#dc2626' }}>
                Are you sure? This will permanently release {originalData?.name}.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={saving}
                >
                  Keep Dragon
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={saving}
                >
                  {saving ? 'Releasing...' : 'Confirm Release'}
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default EditDragon;
