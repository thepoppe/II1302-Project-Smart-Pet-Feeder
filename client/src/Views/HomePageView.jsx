import { Link } from "react-router-dom";
function HomePageView(props) {
  return (
    <>
      <div
        style={{
          textAlign: "center",
          height: "15rem",
          background: "gray",
        }}
      >
        <p>Picture of product</p>
      </div>
      <div>
        <ul className="homeUL">
          <li className="homeLI">
            <Link to="/schedule">
              <p>Schedule</p>
            </Link>
          </li>
          <li className="homeLI">
            <Link to="/status">
              <p>Status</p>
            </Link>
          </li>
          <li className="homeLI">
            <Link to="/settings">
              <p>Settings</p>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
export default HomePageView;
