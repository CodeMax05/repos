import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
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

function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mod, setMod] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        guitarPart: "",
        partURL: "",
        description: "",
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        fetchMod();
        fetchComments();
    }, [id]);

    async function fetchMod() {
        try {
            const { data, error } = await supabase
                .from("Mods")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;
            setMod(data);
            setFormData({
                guitarPart: data.guitarPart,
                partURL: data.partURL || "",
                description: data.description,
            });
        } catch (err) {
            console.error("Error fetching mod:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function fetchComments() {
        try {
            const { data, error } = await supabase
                .from("Comments")
                .select("*")
                .eq("modID", id)
                .order("created_at", { ascending: true });

            if (error) throw error;
            setComments(data || []);
        } catch (err) {
            console.error("Error fetching comments:", err);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);

        try {
            const { error } = await supabase
                .from("Mods")
                .update({
                    guitarPart: formData.guitarPart,
                    partURL: formData.partURL,
                    description: formData.description,
                })
                .eq("id", id);

            if (error) throw error;

            setMod({
                ...mod,
                ...formData,
            });
            setEditing(false);
        } catch (err) {
            console.error("Error updating mod:", err);
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this mod?")) return;

        try {
            const { error } = await supabase.from("Mods").delete().eq("id", id);

            if (error) throw error;

            navigate("/posts");
        } catch (err) {
            console.error("Error deleting mod:", err);
            setError(err.message);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmittingComment(true);
        setError(null);

        try {
            const { error } = await supabase.from("Comments").insert([
                {
                    modID: id,
                    content: newComment.trim(),
                },
            ]);

            if (error) throw error;

            setNewComment("");
            fetchComments();
        } catch (err) {
            console.error("Error adding comment:", err);
            setError(err.message);
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!confirm("Delete this comment?")) return;

        try {
            const { error } = await supabase.from("Comments").delete().eq("id", commentId);

            if (error) throw error;

            setComments(comments.filter((c) => c.id !== commentId));
        } catch (err) {
            console.error("Error deleting comment:", err);
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="post-detail-page">
                <p className="loading">Loading post...</p>
            </div>
        );
    }

    if (error && !mod) {
        return (
            <div className="post-detail-page">
                <div className="error-container">
                    <p className="error">Error: {error}</p>
                    <button className="back-btn" onClick={() => navigate("/posts")}>
                        Back to Posts
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="post-detail-page">
            <div className="detail-header">
                <button className="back-btn" onClick={() => navigate("/posts")}>
                    ← Back to Posts
                </button>
                <div className="detail-actions">
                    {!editing ? (
                        <>
                            <button className="edit-btn" onClick={() => setEditing(true)}>
                                Edit
                            </button>
                            <button className="delete-btn" onClick={handleDelete}>
                                Delete
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="cancel-btn"
                                onClick={() => {
                                    setEditing(false);
                                    setFormData({
                                        guitarPart: mod.guitarPart,
                                        partURL: mod.partURL || "",
                                        description: mod.description,
                                    });
                                }}
                            >
                                Cancel
                            </button>
                            <button className="save-btn" onClick={handleSave} disabled={saving}>
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="detail-content">
                {editing ? (
                    <div className="edit-form">
                        <div className="form-group">
                            <label htmlFor="guitarPart">Guitar Part</label>
                            <select
                                id="guitarPart"
                                name="guitarPart"
                                value={formData.guitarPart}
                                onChange={handleInputChange}
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
                                onChange={handleInputChange}
                                placeholder="https://example.com/part"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe the mod..."
                                rows={6}
                                required
                            />
                        </div>

                        {error && <p className="form-error">{error}</p>}
                    </div>
                ) : (
                    <>
                        <div className="detail-card">
                            <div className="detail-header-content">
                                <span className="detail-part-badge">{mod.guitarPart}</span>
                                <span className="detail-date">
                                    {new Date(mod.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <h2>Mod Description</h2>
                            <p className="detail-description">{mod.description}</p>
                            {mod.partURL && (
                                <div className="detail-link-section">
                                    <h3>Part Link</h3>
                                    <a
                                        href={mod.partURL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="detail-link"
                                    >
                                        {mod.partURL} →
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="comments-section">
                            <h3>Comments ({comments.length})</h3>

                            <form onSubmit={handleAddComment} className="comment-form">
                                <textarea
                                    className="comment-input"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    rows={3}
                                    disabled={submittingComment}
                                />
                                <button
                                    type="submit"
                                    className="submit-comment-btn"
                                    disabled={submittingComment || !newComment.trim()}
                                >
                                    {submittingComment ? "Posting..." : "Post Comment"}
                                </button>
                            </form>

                            <div className="comments-list">
                                {comments.length === 0 ? (
                                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                                ) : (
                                    comments.map((comment) => (
                                        <div key={comment.id} className="comment-card">
                                            <div className="comment-header">
                                                <span className="comment-date">
                                                    {new Date(comment.created_at).toLocaleDateString()}
                                                </span>
                                                <button
                                                    className="delete-comment-btn"
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                            <p className="comment-content">{comment.content}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default PostDetail;
