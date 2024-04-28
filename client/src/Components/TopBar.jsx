import { Link } from "react-router-dom";
import "./TopBar.css";
export default function TopBar(props) {
  let loggedIn = props.loggedIn;
  return (
    <>
      <nav>
        <ul className="navigation">
          <li className="navcenter-link">
            <Link to="/">
              <h2 className="brand-logo">🐾 Smart Feeder</h2>
            </Link>
          </li>
          {loggedIn && (
            <div className="dropdown">
              <Link to="/settings">
                <p>Profile</p>
              </Link>
              <div className="dropdown-content">
                <button className="dropdownbtn" disabled>
                  About
                </button>
                <button onClick={() => props.logOut()} className="dropdownbtn">
                  Log Out
                </button>
              </div>
            </div>
          )}
        </ul>
      </nav>
    </>
  );
}
