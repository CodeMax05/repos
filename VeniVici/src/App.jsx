import { useState } from 'react'
import './App.css'
import gif from '../src/assets/VeniVici.gif'

const ACCESS_KEY = import.meta.env.VITE_DOG_ACCESS_KEY;
const BASE_URL = 'https://api.thedogapi.com/v1';
const HEADERS = { 'x-api-key': ACCESS_KEY };

function App() {
  const [dogImage, setDogImage] = useState(null);
  const [breedInfo, setBreedInfo] = useState(null);
  const [dogFact, setDogFact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [banList, setBanList] = useState([]);

  const addToBanList = (attribute) => {
    if (!banList.includes(attribute)) {
      setBanList([...banList, attribute]);
    }
  };

  const removeFromBanList = (attribute) => {
    setBanList(banList.filter(item => item !== attribute));
  };

  const isBanned = (breed) => {
    if (!breed) return false;
    const attributes = [
      breed.life_span,
      breed.breed_group,
      breed.origin,
      ...(breed.temperament?.split(',').map(t => t.trim()) || [])
    ].filter(Boolean);
    return attributes.some(attr => banList.includes(attr));
  };

  const fetchRandomDog = async () => {
    setLoading(true);
    setDogFact(null);

    try {
      let breed = null;
      let imageData = null;
      let attempts = 0;
      const maxAttempts = 10;

      // Keep fetching until we get a non-banned breed or hit max attempts
      while (attempts < maxAttempts) {
        // Step 1: Get a random image that includes breed info
        const imageRes = await fetch(
          `${BASE_URL}/images/search?limit=1&has_breeds=1`,
          { headers: HEADERS }
        );
        const [imgData] = await imageRes.json();
        imageData = imgData;

        // Step 2: Fetch full image details to get the breeds array
        const detailsRes = await fetch(
          `${BASE_URL}/images/${imageData.id}`,
          { headers: HEADERS }
        );
        const details = await detailsRes.json();

        breed = details.breeds?.[0];

        // Check if this breed is banned
        if (!isBanned(breed)) {
          break;
        }

        attempts++;
      }

      setDogImage(imageData.url);

      if (breed) {
        setBreedInfo(breed);

        // Step 3: Get a fact about that same breed
        const factRes = await fetch(
          `${BASE_URL}/breeds/${breed.id}/facts?limit=1`,
          { headers: HEADERS }
        );
        const facts = await factRes.json();

        if (Array.isArray(facts) && facts.length > 0) {
          setDogFact(facts[0].fact);
        } else {
          setDogFact(null);
        }
      } else {
        setBreedInfo(null);
      }
    } catch (err) {
      alert('Could not fetch dog data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to render clickable attribute
  const ClickableAttribute = ({value}) => {
    if (!value) return null;
    return (
      <span
        className="clickable-attribute"
        onClick={() => addToBanList(value)}
        title="Click to ban this attribute"
      >
        {value}
      </span>
    );
  };

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <div className="main-content">
          <div className="content-wrapper">
            <div className="doggy-page">
              <h1>Veni Vici!</h1>
              <p className="subtitle">Discover the wonderful world of Dogs!</p>

              <button onClick={fetchRandomDog} disabled={loading}>
                {loading ? 'Fetching...' : dogImage ? 'Discover Another!' : 'Discover!'}
              </button>

              {dogImage && (
                <div className="dog-card">
                  <img
                    src={dogImage}
                    alt={breedInfo?.name ?? 'A dog'}
                    className="dog-image"
                  />

                  {breedInfo && (
                    <div className="breed-info">
                      <h2>{breedInfo.name}</h2>
                      <div className="breed-details">
                        {breedInfo.temperament && (
                          <p>
                            <strong>Temperament:</strong>{' '}
                            {breedInfo.temperament.split(',').map((t, i, arr) => (
                              <span key={i}>
                                <ClickableAttribute value={t.trim()} />
                                {i < arr.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </p>
                        )}
                        {breedInfo.life_span && (
                          <p>
                            <strong>Life Span:</strong>{' '}
                            <ClickableAttribute value={breedInfo.life_span} />
                          </p>
                        )}
                        {breedInfo.bred_for && (
                          <p><strong>Bred For:</strong> {breedInfo.bred_for}</p>
                        )}
                        {breedInfo.breed_group && (
                          <p>
                            <strong>Group:</strong>{' '}
                            <ClickableAttribute value={breedInfo.breed_group} />
                          </p>
                        )}
                        {breedInfo.origin && (
                          <p>
                            <strong>Origin:</strong>{' '}
                            <ClickableAttribute value={breedInfo.origin} />
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {dogFact && (
                    <div className="dog-fact">
                      <h3>Fun Fact</h3>
                      <p>{dogFact}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

              <img className='video' src={gif} title='Video Walkthrough' width='' alt='Video Walkthrough' />

        <div className="ban-list-panel">
          <h3>Ban List</h3>
          <p className="ban-list-subtitle">Click attributes to ban them</p>
          {banList.length === 0 ? (
            <p className="ban-list-empty">No banned attributes</p>
          ) : (
            <div className="ban-list-items">
              {banList.map((item) => (
                <span
                  key={item}
                  className="ban-list-item"
                  onClick={() => removeFromBanList(item)}
                  title="Click to remove from ban list"
                >
                  {item} ×
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App
