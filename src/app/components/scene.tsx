"use client";

import React, { useState, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

import { Sign } from "./sign";
import { Floor } from "./floor";
import { AboutMe } from "./aboutme";

export function Scene() {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // CAMERA POSITION starts near the sign
  const [cameraTarget, setCameraTarget] = useState(() => new THREE.Vector3(0, 3, 10));
  // ORBIT TARGET starts near the sign’s center (x=0,y=3,z=0)
  const [orbitTarget, setOrbitTarget] = useState(() => new THREE.Vector3(-0, 3, 0));

  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(...cameraTarget.toArray()), 0.05);
    controlsRef.current?.target.lerp(new THREE.Vector3(...orbitTarget.toArray()), 0.05);
    controlsRef.current?.update();
  });

  // Triggered when user clicks an arrow on the sign
  const handleArrowClick = (arrowName: string) => {
    switch (arrowName) {
        case "Arrow1":
          console.log("Moving to AboutMe Board...");
          setCameraTarget(new THREE.Vector3(-100, 3, 10));
          setOrbitTarget(new THREE.Vector3(-100, 3, 0));
          break;
    
        case "BackArrow":
          console.log("Moving Back to Sign...");
          
          setCameraTarget(new THREE.Vector3(0, 3, 10));
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

      {/* OrbitControls with a ref so we can manipulate the .target */}
      <OrbitControls
        ref={controlsRef}
        minPolarAngle={0}
        maxPolarAngle={(Math.PI / 2) - 0.1}
      />

      <Floor />

      {/* Sign with clickable arrows */}
      <Sign onArrowClick={handleArrowClick} />

      {/* AboutMe board placed at x=100 */}
      <AboutMe onArrowClick={handleArrowClick} />
    </>
  );
}
