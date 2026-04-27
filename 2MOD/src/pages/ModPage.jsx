import { useState, useEffect } from "react";
import { Link } from "react-router";
import guitarImage from "../assets/Guitar.png";
import { supabase } from "../client";

const PART_CATEGORIES = [
    { name: "Body", icon: "🎸", description: "Body shapes, wood types, finishes" },
    { name: "Electronics", icon: "🔌", description: "Pickups, pots, switches, wiring" },
    { name: "Bridge", icon: "🌉", description: "Fixed bridges, tremolos, hardware" },
    { name: "Neck", icon: "📏", description: "Neck profiles, fretboards, scale" },
    { name: "Tuners", icon: "🎛️", description: "Tuning machines, locking tuners" },
    { name: "Nut", icon: "⚪", description: "Nut materials, slot widths" },
];

function ModPage() {
    const [modCounts, setModCounts] = useState({});

    useEffect(() => {
        async function fetchModCounts() {
            const counts = {};
            for (const part of PART_CATEGORIES) {
                const { count } = await supabase
                    .from("Mods")
                    .select("*", { count: "exact", head: true })
                    .eq("guitarPart", part.name);
                counts[part.name] = count || 0;
            }
            setModCounts(counts);
        }
        fetchModCounts();
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
                <img src={guitarImage} alt="Electric Guitar" className="guitar-image" />
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
