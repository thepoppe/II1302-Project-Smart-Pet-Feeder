import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import "./TopBar.css";
import logo from '../icons/logo.png';


import { UserOutlined } from '@ant-design/icons';
import { Button, Dropdown} from 'antd';

export default function TopBar(props) {
  let loggedIn = props.loggedIn;

  const items = [
    {
      label: ( <Link to="/" className="brand-logo" onClick={handleLogout}>
      logout
    </Link>),
      key : "1",
      icon: <UserOutlined/>,
    }
    ,
    {
      label :( <Link to="/about">About</Link>),
      key : "2",
    },
  ];

  const menuprops = {items,};



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
      <nav >
      <ul className="ul">
        <li className="logo">
          <Link to="/" className="brand-logo">
            <img src={logo}  height={75} />
          </Link>
        </li>
      
      {  loggedIn &&
        (
        <li >
        <Dropdown menu={menuprops} placement="bottom" >
        <Button className="dropdown">
        <UserOutlined style={{ fontSize: '20px'}}/>
        </Button>
        </Dropdown>
        </li>
        )
   }
      </ul>
    </nav>
    </>
  );
}

