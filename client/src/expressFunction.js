export function toggleMotor() {
  fetch("http://localhost:3000/toggle-motor", {
    method: "POST",
  })
    .then((response) => response.text())
    .then((data) => setContent(data))
    .catch((error) => console.error("Error:", error));
}
