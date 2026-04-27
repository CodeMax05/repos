import { useState, useEffect } from "react";
import { Link } from "react-router";
import guitarImage from "../assets/Guitar.png";
import { supabase } from "../client";
import { PART_CATALOG } from "../data/partCatalog";

const HOTSPOT_COORDS = {
    Body: { left: "55%", top: "90%" },
    Electronics: { left: "72%", top: "67%" },
    Bridge: { left: "60%", top: "81.5%" },
    Neck: { left: "59%", top: "50%" },
    Tuners: { left: "60%", top: "14%" },
    Nut: { left: "59%", top: "22%" },
};

const PART_CATEGORIES = PART_CATALOG.map((part) => ({
    ...part,
    hotspot: HOTSPOT_COORDS[part.name],
}));

function ModPage() {
    const [modCounts, setModCounts] = useState({});

    useEffect(() => {
        let isMounted = true;
        async function fetchModCounts() {
            const countEntries = await Promise.all(
                PART_CATEGORIES.map(async (part) => {
                    const { count, error } = await supabase
                        .from("Mods")
                        .select("*", { count: "exact", head: true })
                        .eq("guitarPart", part.name);

                    if (error) {
                        console.error(`Failed to count mods for ${part.name}:`, error);
                        return [part.name, 0];
                    }

                    return [part.name, count || 0];
                })
            );

            if (!isMounted) {
                return;
            }

            setModCounts(Object.fromEntries(countEntries));
        }
        fetchModCounts();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="mod-page">
            <div className="mod-header">
                <h1>Electric Guitar Mods</h1>
                <Link to="/mod/add" className="add-mod-btn">
                    + Add MOD
                </Link>
            </div>
            <div className="guitar-container">
                <div className="guitar-map">
                    <img src={guitarImage} alt="Electric Guitar" className="guitar-image" />
                    {PART_CATEGORIES.map((part) => (
                        <Link
                            key={`${part.name}-hotspot`}
                            to={`/mod/part/${encodeURIComponent(part.name)}`}
                            className="guitar-hotspot"
                            style={{ left: part.hotspot.left, top: part.hotspot.top }}
                            aria-label={`View ${part.name} mod suggestions`}
                            title={part.name}
                        >
                            <span className="guitar-hotspot-dot" aria-hidden="true" />
                            <span className="guitar-hotspot-label">{part.name}</span>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="parts-section">
                <h2>Browse Mods by Part</h2>
                <div className="parts-grid">
                    {PART_CATEGORIES.map((part) => (
                        <Link
                            key={part.name}
                            to={`/mod/part/${encodeURIComponent(part.name)}`}
                            className="part-card"
                        >
                            <img
                                className="part-icon-image"
                                src={part.image}
                                alt={`${part.name} part`}
                            />
                            <h3>{part.name}</h3>
                            <p className="part-description">{part.description}</p>
                            <span className="mod-count">
                                {modCounts[part.name] || 0} mod{(modCounts[part.name] || 0) !== 1 ? "s" : ""}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ModPage;
