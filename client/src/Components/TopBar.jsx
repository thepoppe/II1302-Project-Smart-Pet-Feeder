import { Link } from "react-router-dom";
export default function TopBar() {
  return (
    <>
      <nav className="navigation">
      <ul>
        <li>
          <Link to="/" className="brand-logo">
            🐾 Smart Feeder
          </Link>
        </li>
        <li>
          <Link to="/about" className="about-link">
            About
          </Link>
        </li>
      </ul>
    </nav>
    </>
  );
}


