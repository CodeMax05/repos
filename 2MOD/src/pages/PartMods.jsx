import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { supabase } from "../client";

const PART_TITLES = {
    Body: "Body Mods",
    Electronics: "Electronics Mods",
    Bridge: "Bridge Mods",
    Neck: "Neck Mods",
    Tuners: "Tuners Mods",
    Nut: "Nut Mods",
};

function PartMods() {
    const { part } = useParams();
    const navigate = useNavigate();
    const [mods, setMods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const partName = decodeURIComponent(part || "");
    const pageTitle = PART_TITLES[partName] || `${partName} Mods`;

    useEffect(() => {
        async function fetchMods() {
            if (!partName) {
                setMods([]);
                setLoading(false);
                return;
            }
            try {
                const { data, error } = await supabase
                    .from("Mods")
                    .select("*")
                    .eq("guitarPart", partName)
                    .order("created_at", { ascending: false });

                if (error) throw error;
                setMods(data || []);
            } catch (err) {
                console.error("Error fetching mods:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchMods();
    }, [partName]);

    return (
        <div className="part-mods-page">
            <div className="part-header">
                <button className="back-btn" onClick={() => navigate("/mod")}>
                    ← Back to Mods
                </button>
                <h1>{pageTitle}</h1>
            </div>

            <div className="mods-list">
                {loading ? (
                    <p className="loading">Loading mods...</p>
                ) : error ? (
                    <p className="error">Error: {error}</p>
                ) : mods.length === 0 ? (
                    <div className="no-mods">
                        <p>No mods submitted yet for {partName}</p>
                        <button className="add-first-btn" onClick={() => navigate("/mod/add")}>
                            Be the first to add a mod!
                        </button>
                    </div>
                ) : (
                    mods.map((mod, index) => (
                        <Link
                            key={mod.id || `${mod.guitarPart}-${mod.partURL || index}`}
                            to={`/posts/${mod.id}`}
                            className="mod-card"
                        >
                            <div className="mod-card-header">
                                <span className="mod-part-badge">{mod.guitarPart}</span>
                                <span className="mod-date">
                                    {mod.created_at ? new Date(mod.created_at).toLocaleDateString() : "Recently added"}
                                </span>
                            </div>
                            <p className="mod-description">{mod.description}</p>
                            {mod.partURL && (
                                <span className="mod-link">
                                    View Part →
                                </span>
                            )}
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}

export default PartMods;
