import { useState, useEffect } from "react";
import { Link } from "react-router";
import guitarImage from "../assets/Guitar.png";
import { supabase } from "../client";

const PART_CATEGORIES = [
    {
        name: "Body",
        icon: "🎸",
        description: "Body shapes, wood types, finishes",
        hotspot: { left: "55%", top: "90%" },
    },
    {
        name: "Electronics",
        icon: "🔌",
        description: "Pickups, pots, switches, wiring",
        hotspot: { left: "72%", top: "67%" },
    },
    {
        name: "Bridge",
        icon: "🌉",
        description: "Fixed bridges, tremolos, hardware",
        hotspot: { left: "60%", top: "81.5%" },
    },
    {
        name: "Neck",
        icon: "📏",
        description: "Neck profiles, fretboards, scale",
        hotspot: { left: "58%", top: "50%" },
    },
    {
        name: "Tuners",
        icon: "🎛️",
        description: "Tuning machines, locking tuners",
        hotspot: { left: "60%", top: "14%" },
    },
    {
        name: "Nut",
        icon: "⚪",
        description: "Nut materials, slot widths",
        hotspot: { left: "58%", top: "22%" },
    },
];

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
                            <span className="part-icon">{part.icon}</span>
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
