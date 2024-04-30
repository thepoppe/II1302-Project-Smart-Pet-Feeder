import { Link } from "react-router-dom";

import {Canvas} from "@react-three/fiber";
import {useGLTF, Stage, PresentationControls} from "@react-three/drei";

function Model(props){
  const {scene} = useGLTF("../../feeder.glb");
  return <primitive  object={scene} {...props}/>
}


function HomePageView(props) {
  return (
    <>
    <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh", // This will make the parent div take the full height of the viewport
    width: "100vw", // This will make the parent div take the full width of the viewport
    
  }}
>
      <div
     className="threeDstyle"

    style={{
      marginTop: "1rem",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "25rem", // Increase the height
      width: "40rem", // Increase the width
      alignContent: "center",
    }}
      >
        <Canvas className="threeDstyle" dpr={[1,2]}  camera={{fov: 45}}  style={{
     width: '100%', // Canvas fills the container div
     height: '100%', // Canvas fills the container div
     
    }} >
            
            <PresentationControls speed={1.5} zoom={.5} polar={[-0.1, Math.PI / 4]} >
            <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
            <Stage environment={"sunset"}>
              <Model scale={0.01} />

            </Stage>

            </PresentationControls>
            
        </Canvas>
        
        </div>
      </div>

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
