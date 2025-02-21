"use client";

import React, { useState, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

import { Sign } from "./sign";
import { Floor } from "./floor";
import { AboutMe } from "./aboutme";
import { Resume } from "./resume";

export function Scene() {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Track user zoom level
  const [zoomLevel, setZoomLevel] = useState(camera.position.z);

  // CAMERA POSITION starts near the sign
  const [cameraTarget, setCameraTarget] = useState(new THREE.Vector3(0, 3, zoomLevel));
  // ORBIT TARGET starts near the sign’s center (x=0,y=3,z=0)
  const [orbitTarget, setOrbitTarget] = useState(new THREE.Vector3(0, 3, 0));

  // Preserve user zoom level
  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(cameraTarget.x, cameraTarget.y, zoomLevel), 0.05);
    controlsRef.current?.target.lerp(orbitTarget, 0.05);
    controlsRef.current?.update();
  });

  // Track zooming from OrbitControls
  const handleZoom = () => {
    setZoomLevel(camera.position.z);
  };

  // Handle arrow clicks for navigation
  const handleArrowClick = (arrowName: string) => {
    console.log(`Clicked Arrow: ${arrowName}`);

    switch (arrowName) {
      case "Arrow1":
        console.log("Moving to AboutMe Board...");
        setCameraTarget(new THREE.Vector3(-100, 3, zoomLevel));
        setOrbitTarget(new THREE.Vector3(-100, 3, 0));
        break;

      case "Arrow2":
        console.log("Moving to Resume Board...");
        setCameraTarget(new THREE.Vector3(100, 10, zoomLevel));
        setOrbitTarget(new THREE.Vector3(100, 10, 0));
        break;

      case "BackArrow":
        console.log("Moving Back to Sign...");
        setCameraTarget(new THREE.Vector3(0, 3, zoomLevel));
        setOrbitTarget(new THREE.Vector3(0, 3, 0));
        break;

      default:
        console.warn(`Unrecognized arrow: ${arrowName}`);
        break;
    }
  };

  return (
    <>
      <color attach="background" args={["lightblue"]} />

      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 10]} />

      {/* OrbitControls with improved settings */}
      <OrbitControls
        ref={controlsRef}
        enableDamping={true} // Smooth movement
        dampingFactor={0.1} // Reduce laggy movement
        enableZoom={true} // Allow zooming
        minDistance={5} // Prevent zooming too close
        maxDistance={30} // Prevent zooming too far
        enablePan={true} // Allow dragging
        onChange={handleZoom} // Track zoom level
      />

      <Floor />

      {/* Sign with arrow click detection */}
      <Sign onArrowClick={handleArrowClick} />

      {/* AboutMe board placed at x=-100 */}
      <AboutMe onArrowClick={handleArrowClick} />
      
      {/* Resume board placed at x=100 */}
      <Resume onArrowClick={handleArrowClick} />
    </>
  );
}
