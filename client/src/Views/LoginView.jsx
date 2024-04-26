export default function LoginView(props) {
  return (

    <><div>
      <span className="login">Welcome to our app.</span>
      <h2 className="h2">Log in with your Google account to customize your Pet Feeder.</h2>
      <div>
      </div>
      
      </div>
      <div>

      <button
        onClick={() => {
          console.log("Logging in");
          props.login();
        }}
      >
        Press to log in
      </button>

      </div>
    </>
  );
}
