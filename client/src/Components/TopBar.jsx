import { Link } from "react-router-dom";
export default function TopBar() {
  return (
    <>
      <nav className="navigation">
        <ul>
          <li>
            <Link to="/">
              <h2>Smart Pet Feeder</h2>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
