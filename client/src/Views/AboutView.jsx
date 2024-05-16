import { Link } from "react-router-dom";
function About(props) {
    return (
        <>
            <div className="aboutPage">
                <header>
                    <h1>About Smart Pet Feeder</h1>
                </header>

                <main>
                    <section>
                        <h2>Our Team</h2>
                        <p>
                            Meet the talented individuals behind Smart Pet Feeder:
                        </p>
                        <ul>
                            <li>
                                <strong>Puntos Morin</strong> - Scrum Master and Backend Developer: 
                                Oversees project management, system architecture, and backend development, including 3D design, web hosting, database setup, React development, CSS design, and testing.
                            </li>
                            <li>
                                <strong>Lukas Jakobsen</strong> - Project Coordinator and Software Developer:
                                Manages project coordination, ensures seamless communication between frontend and backend, and contributes to software development and UX design.
                            </li>
                            <li>
                                <strong>Batuhan Nur</strong> - Project Owner and Hardware Developer:
                                Leads hardware development, specializing in hardware programming, communication protocols, and data persistence.
                            </li>
                            <li>
                                <strong>Ahmad Matar</strong> - Software Developer and UX Designer:
                                Implements UX design using Figma, CSS styling, and data persistence, enhancing the user experience.
                            </li>
                            <li>
                                <strong>Fariba Mohammadi</strong> - System Architect and Developer:
                                Designs and sets up the database, conducts research, and contributes to UI design.
                            </li>
                        </ul>
                        <p>
                            Each member brings unique skills to ensure the success of our project.
                        </p>
                    </section>

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