import { Link } from 'react-router-dom';
import gif from '../assets/Crewmate.gif'

function Home() {
  return (
    <div className="hero">
      <h1>Welcome to Berk Dragon Academy</h1>
      <p className="tagline">
        Train and manage your dragons to defend Berk from enemy threats.
        Build your dragon crew and become the ultimate Dragon Rider!
      </p>
      <div className="action-buttons">
        <Link to="/dragons/new" className="btn btn-primary">
          🐲 Recruit a Dragon
        </Link>
        <Link to="/dragons" className="btn btn-secondary">
          📋 View Dragon Roster
        </Link>
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'left' }}>
        <h2>Dragon Classes</h2>
        <div className="dragons-grid" style={{ marginTop: '1rem' }}>
          <div className="dragon-card strike">
            <span className="dragon-class-badge strike">Strike Class</span>
            <img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/0d4a8dbf-84c1-46f3-b740-e10dd863774f/d5hwjkz-38ba9559-465e-462a-8bd5-ab8c6eba16d5.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiIvZi8wZDRhOGRiZi04NGMxLTQ2ZjMtYjc0MC1lMTBkZDg2Mzc3NGYvZDVod2prei0zOGJhOTU1OS00NjVlLTQ2MmEtOGJkNS1hYjhjNmViYTE2ZDUucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.n9urSbet2mLdv09VHitr3bPTlz_qyavZEz54ZXwmACU" alt="strike class" />
            <h3>Lightning Fast</h3>
            <p>Strike Class dragons are known for their incredible speed and blazing firepower. The Night Fury is the pride of this class.</p>
          </div>
          <div className="dragon-card sharp">
            <span className="dragon-class-badge sharp">Sharp Class</span>
            <img src="https://www.clipartmax.com/png/full/250-2505514_sharp-class-symbol-by-xelku9-how-to-train-your-dragon-dragon-class.png" alt="sharp class" />
            
            <h3>Deadly Precision</h3>
            <p>Sharp Class dragons possess deadly precision and can slice through anything with their razor-sharp spines and tails.</p>
          </div>
          <div className="dragon-card boulder">
            <span className="dragon-class-badge boulder">Boulder Class</span>
            <img src="https://www.nicepng.com/png/full/204-2042408_boulder-class-symbol-by-xelku9-d5hwini-train-your.png" alt="Boulder class" />
            <h3>Tough as Stone</h3>
            <p>Boulder Class dragons are built tough with rock-hard skin. They can blast dangerous projectiles and withstand heavy attacks.</p>
          </div>
          <div className="dragon-card stoker">
            <span className="dragon-class-badge stoker">Stoker Class</span>
            <img src="https://httyddragons.weebly.com/uploads/4/2/4/5/42457497/1709771.png?250" alt="Stocker class" />
            <h3>Master of Fire</h3>
            <p>Stoker Class dragons are fiery powerhouses with the hottest flames. They can set themselves on fire when enraged.</p>
          </div>
        </div>
      </div>

      <img src={gif} title='Video Walkthrough' width='' alt='Video Walkthrough' />
    </div>
  );
}

export default Home;
