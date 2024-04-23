import { Link } from "react-router-dom";
function HomePageView(props) {
  return (
    <>
      <div
        style={{
          marginTop: "1rem",
          textAlign: "center",
          height: "15rem",
          background: "var(--light-color)",
          alignContent: "center",
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
