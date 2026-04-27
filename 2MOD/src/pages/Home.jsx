import { useState, useEffect } from "react";
import { Link } from "react-router";
import { PART_CATALOG } from "../data/partCatalog";
import { supabase } from "../client";

function Home() {
    const [recentMods, setRecentMods] = useState([]);

    useEffect(() => {
        async function fetchRecentMods() {
            const { data, error } = await supabase
                .from("Mods")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(5);

            if (!error && data) {
                setRecentMods(data);
            }
        }
        fetchRecentMods();
    }, []);

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
                    {PART_CATALOG.map((part) => (
                        <div key={part.name} className="category-card">
                            <img
                                className="category-part-image"
                                src={part.image}
                                alt={`${part.name} part`}
                            />
                            <h3>{part.name}</h3>
                            <p>{part.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {recentMods.length > 0 && (
                <div className="features-section">
                    <h2>Most Recent MODS</h2>
                    <div className="recent-mods-list">
                        {recentMods.map((mod) => (
                            <div key={mod.id} className="recent-mod-card">
                                <div className="recent-mod-header">
                                    <span className="recent-mod-part">{mod.guitarPart}</span>
                                    <span className="recent-mod-date">
                                        {new Date(mod.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="recent-mod-description">{mod.description}</p>
                                {mod.partURL && (
                                    <a
                                        href={mod.partURL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="recent-mod-link"
                                    >
                                        View Part →
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;