import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../client";

const MOD_CATEGORIES = [
    { value: "", label: "Select a part..." },
    { value: "Body", label: "Body" },
    { value: "Electronics", label: "Electronics" },
    { value: "Bridge", label: "Bridge" },
    { value: "Neck", label: "Neck" },
    { value: "Tuners", label: "Tuners" },
    { value: "Nut", label: "Nut" },
];

function ModForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        guitarPart: "",
        partURL: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from('Mods')
                .insert([
                    {
                        guitarPart: formData.guitarPart,
                        partURL: formData.partURL,
                        description: formData.description,
                    },
                ]);

            if (error) throw error;

            console.log("Mod submitted:", data);
            navigate("/mod");
        } catch (err) {
            console.error("Error submitting mod:", err);
            setError(err.message || "Failed to submit mod. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mod-form-page">
            <div className="form-container">
                <h1>Submit a Mod</h1>
                <p className="form-subtitle">Suggest a modification for the electric guitar</p>

                <form onSubmit={handleSubmit} className="mod-form">
                    <div className="form-group">
                        <label htmlFor="guitarPart">Guitar Part</label>
                        <select
                            id="guitarPart"
                            name="guitarPart"
                            value={formData.guitarPart}
                            onChange={handleChange}
                            required
                        >
                            {MOD_CATEGORIES.map((cat) => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="partURL">Part URL (optional)</label>
                        <input
                            type="text"
                            id="partURL"
                            name="partURL"
                            value={formData.partURL}
                            onChange={handleChange}
                            placeholder="https://example.com/part"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the mod, why you recommend it, any installation tips..."
                            rows={5}
                            required
                        />
                    </div>

                    {error && <p className="form-error">{error}</p>}

                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={() => navigate("/mod")} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? "Submitting..." : "Submit Mod"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModForm;
