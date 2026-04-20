import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../client';
import { DRAGON_CLASSES, getDragonClassImage } from '../constants/dragonClasses';

function CreateDragon() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    weight: '',
    dragonClass: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.name.trim() || !formData.dragonClass) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const imageURL = getDragonClassImage(formData.dragonClass);

      const { error: supabaseError } = await supabase
        .from('Dragons')
        .insert([{
          name: formData.name.trim(),
          weight: formData.weight ? parseFloat(formData.weight) : null,
          dragonClass: formData.dragonClass,
          imageURL: imageURL,
        }]);

      if (supabaseError) throw supabaseError;

      navigate('/dragons');
    } catch (err) {
      setError('Failed to recruit dragon. Please try again.');
      console.error('Error creating dragon:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        Recruit a New Dragon
      </h2>

      {error && <div className="error">{error}</div>}

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
            <>
              <p className="class-description">
                {DRAGON_CLASSES.find(c => c.value === formData.dragonClass)?.description}
              </p>
              <img
                src={getDragonClassImage(formData.dragonClass)}
                alt={formData.dragonClass}
                className="dragon-detail-image"
                style={{ height: '120px', marginTop: '0.5rem' }}
              />
            </>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/dragons')}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Recruiting...' : 'Recruit Dragon'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateDragon;
