export default function LoginView(props) {
  return (
    <>
      <h1>Log in now</h1>
      <button
        onClick={() => {
          console.log("Logging in");
          props.login();
        }}
      >
        Press to log in
      </button>
    </>
  );
}
