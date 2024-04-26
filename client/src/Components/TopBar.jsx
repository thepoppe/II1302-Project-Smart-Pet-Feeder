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
          
      </ul>
    </nav>
    </>

  );
}

