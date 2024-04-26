import { Link } from "react-router-dom";
import "./TopBar.css";
export default function TopBar(props) {
  let loggedIn = props.loggedIn;
  return (

    <>
      <nav className="navigation">
      <ul>
        <li>
          <Link to="/" className="brand-logo">
            🐾 Smart Feeder
          </Link>
        </li>
        {loggedIn && (
        <div className="dropdown">
          <Link to="/settings">
            <h2>Profile</h2>
          </Link>
          <div className="dropdown-content">
            <button className="dropdownbtn">Profile</button>
            <button onClick={() => props.logOut()} className="dropdownbtn">Log Out</button>
          </div>
        </div>
      </ul>
    </nav>
    </>

  );
}

