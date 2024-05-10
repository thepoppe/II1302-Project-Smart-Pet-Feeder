export default function Tests() {
  return (
    <>

<button
  onClick={() => {
    const requestBody = {
      distance: 55,
      weight: 55
    };
    const userId = localStorage.getItem('userId');  
    return fetch(`http://localhost:3000/users/${userId}/stats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
    .then(response => response.text())
    .then(text => console.log('Response:', text))
    .catch(error => console.error("Error:", error));
  }}
>
  Test upload distance and weight
</button>


      <button
        onClick={() => {
          const requestBody = {
            key1: "dog1",
            key2: "cat1",
          };

          fetch("http://localhost:3000/testSetDB", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          })
            .then((response) => response.text())
            .then((text) => console.log(text))
            .catch((error) => console.error("Error:", error));
        }}
      >
        Test SET database
      </button>

      <button
        onClick={() => {
          fetch("http://localhost:3000/testGetDB", {
            method: "GET",
          })
            .then((response) => response.text())
            .then((text) => console.log(text))
            .catch((error) => console.error("Error:", error));
        }}
      >
        Test GET database
      </button>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const ipAddress = document.getElementById("ipAddress").value;
          fetch(`http://${ipAddress}:80/auth`, {
            method: "POST",
            headers: {
              "Content-Type": "text/plain",
            },
            body: localStorage.getItem("userId"),
          })
            .then((response) => response.text())
            .then((text) => console.log(text))
            .catch((error) => console.error("Error:", error));
        }}
      >
        <input type="text" id="ipAddress" placeholder="Enter the IP address" />
        <input type="submit" value="Submit" />
      </form>
    </>
  );
}
