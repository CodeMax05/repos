import { Link } from "react-router";

function Home() {
    return (
        <div className="home-page">
            <div className="hero-section">
                <h1>Welcome to 2MOD</h1>
                <p className="tagline">
                    The ultimate destination for electric guitar modifications
                </p>
                <p className="description">
                    Share and discover mods for your electric guitar. From body swaps to
                    electronics upgrades, bridge replacements to neck modifications —
                    find inspiration from the community and contribute your own ideas.
                </p>
                <Link to="/mod" className="cta-button">
                    Explore Mods
                </Link>
            </div>

            <div className="features-section">
                <h2>Popular Mod Categories</h2>
                <div className="categories-grid">
                    <div className="category-card">
                        <img className="category-icon" src="" alt="" />
                        <span className="category-icon">🎸</span>
                        <h3>Body</h3>
                        <p>Body shapes, wood types, finishes, and contours</p>
                    </div>
                    <div className="category-card">
                        <span className="category-icon">🔌</span>
                        <h3>Electronics</h3>
                        <p>Pickups, pots, switches, and wiring configurations</p>
                    </div>
                    <div className="category-card">
                        <span className="category-icon">🌉</span>
                        <h3>Bridge</h3>
                        <p>Fixed bridges, tremolos, and hardware upgrades</p>
                    </div>
                    <div className="category-card">
                        <span className="category-icon">📏</span>
                        <h3>Neck</h3>
                        <p>Neck profiles, fretboards, and scale lengths</p>
                    </div>
                    <div className="category-card">
                        <span className="category-icon">🎛️</span>
                        <h3>Tuners</h3>
                        <p>Tuning machines, locking tuners, and stability</p>
                    </div>
                    <div className="category-card">
                        <span className="category-icon">⚪</span>
                        <h3>Nut</h3>
                        <p>Nut materials, slot widths, and string spacing</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;