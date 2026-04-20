import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <Link to="/" className="logo">
        🐉 Berk Dragon Academy
      </Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/dragons/new">Recruit Dragon</Link>
        <Link to="/dragons">Dragon Roster</Link>
      </div>
    </nav>
  );
}

export default Navigation;
