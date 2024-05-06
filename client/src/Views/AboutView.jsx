import { Link } from "react-router-dom";

function About(props){

    return (
        <>
        <div className="aboutPage">
        <header>
                <h1>About Smart Pet Feeder</h1>
            </header>

            <main>
                <section>
                    <h2>Introduction</h2>
                    <p>Welcome to the Smart Pet Feeder app! Our app is designed to make feeding your pet easier and more convenient. With a range of features, we aim to ensure that your pet receives the care and attention they deserve.</p>
                </section>

                <section>
                    <h2>Key Features</h2>
                    <ul>
                        <li><strong>Feeding Schedule:</strong> Set up a feeding schedule to ensure your pet is fed at regular intervals.</li>
                        <li><strong>Manual Feeding:</strong> Feed your pet manually whenever you want, providing flexibility and control.</li>
                        <li><strong>Food Level Tracking:</strong> Keep track of the food level in both the bowl and the food container, ensuring you never run out of food.</li>
                        <li><strong>Eating Pattern Monitoring:</strong> Monitor your pet's eating patterns to ensure they are maintaining a healthy diet.</li>
                        <li><strong>Pet Profiles:</strong> Create profiles for your pets</li>
                        <li><strong>Notification Alerts:</strong> Receive notifications via email to stay updated on food levels.</li>
                    </ul>
                </section>

               
            </main>

            <footer>
                <p>&copy; 2024 Smart Pet Feeder. All rights reserved.</p>
            </footer>
        </div>
        </>
    );
}

export default About;