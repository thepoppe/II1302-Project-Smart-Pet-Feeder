import { Link } from "react-router-dom";

import { Canvas } from "@react-three/fiber";
import {
  useGLTF,
  Stage,
  PresentationControls,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Suspense } from "react";
import "./homePage.css";

/*
function Model(props){
  const {scene} = useGLTF("../../feeder.glb");
  return <primitive  object={scene} {...props}/>
}
*/

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
        <p>Picture here CAD removed to deploy</p>

        {/*
      <div
        className="threeDstyle"
        style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
           // Increase the width
          alignContent: "center",
        }}>
          <Suspense>
        <Canvas shadows className="threeDstyle" dpr={[1,2]}    style={{
          width: '100%', // Canvas fills the container div
                  height: '100%', // Canvas fills the container div
                  }} >
                 <ambientLight intensity={0.5} />
     <OrbitControls range={[0, 0.35, 0]} maxPolarAngle={1.45}/>
      <PerspectiveCamera makeDefault fov={45} position={[1,1,4]} />
      
        <pointLight position={[10, 10, 10]} />
            <Stage environment={"night"}>
              <Model scale={0.0101} />
          </Stage>
        </Canvas>
        </Suspense>
        
        </div>
*/}
      </div>

      <div>
        <ul className="homeUL">
          <Link to="/schedule">
            <button className="LISchedule homeBTN" title="View your schedule"></button>
            <div>Schedule</div>
          </Link>
          <Link to="/status">
            <button className="LIStatus homeBTN" title="View Feeder status"></button>
            <div style={{ textAlign: "center" }}>Status</div>
          </Link>
          <Link to="/settings">
            <button className="LISetting homeBTN" title="View your settings"></button>
            <div style={{ textAlign: "center" }}>Settings</div>
          </Link>
        </ul>
      </div>
    </>
  );
}
export default HomePageView;
