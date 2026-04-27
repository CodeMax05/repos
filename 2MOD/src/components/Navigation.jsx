import { Link } from "react-router";

function Navigation() {
    return (
        <div className="navbar">
            <nav>
                <Link to="/" className="logo">
                    2MOD
                </Link>
                <div className="pages">
                    <Link to="/">Home</Link>
                    <Link to="/mod">Mods</Link>
                    <Link to="/posts">Posts</Link>
                </div>
            </nav>
        </div>
    )
}

export default Navigation;