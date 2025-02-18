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
  const [orbitTarget, setOrbitTarget] = useState(() => new THREE.Vector3(0, 3, 0));

  useFrame(() => {
    // Lerp the camera position towards cameraTarget
    camera.position.lerp(cameraTarget, 0.05);

    // Lerp the orbit target towards orbitTarget
    controlsRef.current?.target.lerp(orbitTarget, 0.05);

    // Update OrbitControls so it knows camera and target have changed
    controlsRef.current?.update();
  });

  // Triggered when user clicks an arrow on the sign
  const handleArrowClick = (arrowName: string) => {
    switch (arrowName) {
      case "Arrow1":
        // Pan the camera far to the left (x=-100) and keep same y,z offset
        setCameraTarget(new THREE.Vector3(-100, 3, 10));
        // Orbit around the AboutMe board’s position (x=100,y=3,z=0)
        setOrbitTarget(new THREE.Vector3(-100, 3, 0));
        break;

      case "BackArrow1":
        // Pan back to the sign at (0,3,10) and orbit around (0,3,0)
        setCameraTarget(new THREE.Vector3(0, 3, 10));
        setOrbitTarget(new THREE.Vector3(0, 3, 0));
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
      <AboutMe />
    </>
  );
}
