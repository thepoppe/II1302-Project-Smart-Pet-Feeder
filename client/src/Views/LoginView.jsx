import "./login.css"

export default function LoginView(props) {


  return (
    <div className="logincontainer">
      <div className="login"> Welcome to our app. </div>
      <div className="h2"> Log in with your Google account to customize your Pet Feeder.</div>
      <div className="loginBTN">
        <button className="icon-button" onClick={() => {console.log("Logging in"); props.login();}}>
          log in
        </button>
      </div>
    </div>
  );
}

