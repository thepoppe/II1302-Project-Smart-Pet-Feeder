import { Link } from "react-router-dom";
import "./HomepageView.css";
function HomePageView(props) {
  return (
    <>
      <video autoPlay loop className="background-video">
        <source src="../../assets/demo.mp4" type="video/mp4" />
        Video cant be displayed
      </video>

      <div>
        <ul className="homeUL">
          <Link to="/schedule">
            <li className="homeLI">
              <p>Schedule</p>
            </li>
          </Link>
          <Link to="/status">
            <li className="homeLI">
              <p>Status</p>
            </li>
          </Link>
          <Link to="/settings">
            <li className="homeLI">
              <p>Settings</p>
            </li>
          </Link>
        </ul>
      </div>
    </>
  );
}
export default HomePageView;
