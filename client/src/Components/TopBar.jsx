import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import "./TopBar.css";

export default function TopBar(props) {
  let loggedIn = props.loggedIn;

  async function handleLogout() {
    try {
      const auth = getAuth();
      signOut(auth);
      console.log("User logging out");
      localStorage.clear();
      props.logOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  }

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
                <button onClick={handleLogout} className="dropdownbtn">
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
