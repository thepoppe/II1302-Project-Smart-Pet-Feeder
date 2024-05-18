import { Link } from "react-router-dom";
import { Alert} from 'antd';
import Marquee from 'react-fast-marquee';
import { Canvas } from "@react-three/fiber";
import {
  useGLTF,
  Stage,
  PresentationControls,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Suspense, useEffect, useState} from "react";
import "./homePage.css";
import { getDevice } from "../expressFunction";


function Model(props) {
  const { scene } = useGLTF("/feeder.glb");
  return <primitive object={scene} {...props} />;
}

function HomePageView(props) {

  const[deviceFound, setDeviceFound] = useState(false);

  useEffect(()=>{
    getDevice().then((data)=>{
      if (data.state == 200) {
        setDeviceFound(true);
      } else {
        setDeviceFound(false);
      }

     })
  },[])

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
            // Increase the width
            alignContent: "center",
          }}
        >
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
       { deviceFound ? <></>  : <div>

        <Alert
        banner
        message={
          <Marquee pauseOnHover gradient={false}>
            No device has found. Go to the setting page to connect your device
          </Marquee>
        }
    />
        </div>}
      </div>
    </>
  );
}
export default HomePageView;
