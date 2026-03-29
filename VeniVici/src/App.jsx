import { useState } from 'react'
import './App.css'

const ACCESS_KEY = import.meta.env.VITE_DOG_ACCESS_KEY;
const BASE_URL = 'https://api.thedogapi.com/v1';
const HEADERS = { 'x-api-key': ACCESS_KEY };

function App() {
  const [dogImage, setDogImage] = useState(null);
  const [breedInfo, setBreedInfo] = useState(null);
  const [dogFact, setDogFact] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRandomDog = async () => {
    setLoading(true);
    setDogFact(null);

    try {
      // Step 1: Get a random image that includes breed info
      const imageRes = await fetch(
        `${BASE_URL}/images/search?limit=1&has_breeds=1`,
        { headers: HEADERS }
      );
      const [imageData] = await imageRes.json();

      setDogImage(imageData.url);

      const breed = imageData.breeds?.[0];
      if (breed) {
        setBreedInfo(breed);

        // Step 2: Get a fact about that same breed
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

  return (
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
                  <p><strong>Temperament:</strong> {breedInfo.temperament}</p>
                )}
                {breedInfo.life_span && (
                  <p><strong>Life Span:</strong> {breedInfo.life_span}</p>
                )}
                {breedInfo.bred_for && (
                  <p><strong>Bred For:</strong> {breedInfo.bred_for}</p>
                )}
                {breedInfo.breed_group && (
                  <p><strong>Group:</strong> {breedInfo.breed_group}</p>
                )}
                {breedInfo.origin && (
                  <p><strong>Origin:</strong> {breedInfo.origin}</p>
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
  );
}

export default App
