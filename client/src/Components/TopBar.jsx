import { Link } from "react-router-dom";
import "./TopBar.css";
export default function TopBar(props) {
  let loggedIn = props.loggedIn;
  return (
    <nav className="navigation">
      <Link to="/" className="navcenter-link">
        <h2>Smart Pet Feeder</h2>
      </Link>
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
      )}
    </nav>
  );
}
