import { useState, useEffect } from "react";
import { Link } from "react-router";
import { supabase } from "../client";

function Posts() {
    const [mods, setMods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPart, setSelectedPart] = useState("");

    const PART_OPTIONS = [
        { value: "", label: "All Parts" },
        { value: "Body", label: "Body" },
        { value: "Electronics", label: "Electronics" },
        { value: "Bridge", label: "Bridge" },
        { value: "Neck", label: "Neck" },
        { value: "Tuners", label: "Tuners" },
        { value: "Nut", label: "Nut" },
    ];

    useEffect(() => {
        fetchMods();
    }, []);

    async function fetchMods() {
        try {
            const { data, error } = await supabase
                .from("Mods")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setMods(data || []);
        } catch (err) {
            console.error("Error fetching mods:", err);
        } finally {
            setLoading(false);
        }
    }

    const filteredMods = mods.filter((mod) => {
        const matchesSearch =
            searchTerm === "" ||
            mod.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mod.guitarPart.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesPart = selectedPart === "" || mod.guitarPart === selectedPart;

        return matchesSearch && matchesPart;
    });

    return (
        <div className="posts-page">
            <div className="posts-header">
                <h1>All MOD Posts</h1>
                <Link to="/mod/add" className="add-mod-btn">
                    + Add MOD
                </Link>
            </div>

            <div className="search-section">
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search mods by description or part..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="part-filter"
                        value={selectedPart}
                        onChange={(e) => setSelectedPart(e.target.value)}
                    >
                        {PART_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <p className="results-count">
                    Showing {filteredMods.length} of {mods.length} mods
                </p>
            </div>

            <div className="posts-grid">
                {loading ? (
                    <p className="loading">Loading posts...</p>
                ) : filteredMods.length === 0 ? (
                    <div className="no-results">
                        <p>No mods found matching your search</p>
                        {searchTerm || selectedPart ? (
                            <button
                                className="clear-search-btn"
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedPart("");
                                }}
                            >
                                Clear filters
                            </button>
                        ) : (
                            <Link to="/mod/add" className="add-first-btn">
                                Be the first to add a mod!
                            </Link>
                        )}
                    </div>
                ) : (
                    filteredMods.map((mod) => (
                        <Link key={mod.id} to={`/posts/${mod.id}`} className="post-card">
                            <div className="post-card-header">
                                <span className="post-part-badge">{mod.guitarPart}</span>
                                <span className="post-date">
                                    {new Date(mod.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="post-description">{mod.description}</p>
                            {mod.partURL && (
                                <span className="post-link">
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

export default Posts;
