export default function Tests() {
  return (
    <>
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
    </>
  );
}
