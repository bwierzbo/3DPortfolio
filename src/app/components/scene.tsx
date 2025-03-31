"use client";

import React, { useState, useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";

import { Sign } from "./sign";
import { AboutMe } from "./aboutme";
import { Resume } from "./resume";
import { Projects } from "./projects"
import { Ground } from "./ground";
import { SkyBackground } from "./skybackground";

export function Scene() {
  const { camera, size } = useThree();
  const controlsRef = useRef<OrbitControlsType | null>(null);

  //Locations
const Locations = {
  home: new THREE.Vector3(0, 5, 10),
  about: new THREE.Vector3(-100, 5, 10),
  projects: new THREE.Vector3(200, 7, 10),
  resume1: new THREE.Vector3(98, 8, 5),
  resume2: new THREE.Vector3(107, 8, 5),
  resume3: new THREE.Vector3(116, 8, 5),
}
const Targets = {
  home: new THREE.Vector3(0, 3, 0),
  about: new THREE.Vector3(-100, 5, 0),
  projects: new THREE.Vector3(200, 5, 0),
  resume1: new THREE.Vector3(98, 8, 0),
  resume2: new THREE.Vector3(107, 8, 0),
  resume3: new THREE.Vector3(116, 8, 0),
}

const Socials: Record<string, string> = {
  LinkedIn: "https://www.linkedin.com/in/benjamin-wierzbanowski/",
  Github: "https://github.com/bwierzbo",
  Gmail: "benjaminwierzbanowski@gmail.com"
}

  // 🎯 Camera & Target Positions
  const [cameraTarget, setCameraTarget] = useState(Locations.home);
  const [orbitTarget, setOrbitTarget] = useState(Targets.home);

  // 📌 Track if camera is moving
  const [isTransitioning, setIsTransitioning] = useState(false);

  // ✅ Dynamically adjust FOV based on screen size
  useEffect(() => {
    const updateFOV = () => {
      if (camera instanceof THREE.PerspectiveCamera) {
        const aspectRatio = size.width / size.height;
        camera.fov = aspectRatio < 1.5 ? 90 : 75;
        camera.updateProjectionMatrix();
      }
    };
    updateFOV();
    window.addEventListener("resize", updateFOV);
    return () => window.removeEventListener("resize", updateFOV);
  }, [camera, size]);

  // ✅ Initial Camera Setup (Lock OrbitControls to Start Position)
  useEffect(() => {
    camera.position.set(0, 5, 10);
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 3, 0);
    }
  }, [camera]);

  // ✅ Smoothly move camera & OrbitControls target
  useFrame(() => {
    if (!controlsRef.current) return;

    if (isTransitioning) {
      // 🔹 Lerp Camera Position & Orbit Target
      camera.position.lerp(cameraTarget, 0.05);
      controlsRef.current.target.lerp(orbitTarget, 0.05);
      controlsRef.current.update();

      // 🔹 Stop transitioning when close enough
      if (
        camera.position.distanceTo(cameraTarget) < 0.1 &&
        controlsRef.current.target.distanceTo(orbitTarget) < 0.1
      ) {
        camera.position.copy(cameraTarget);
        controlsRef.current.target.copy(orbitTarget);
        setIsTransitioning(false);

        // ✅ FIX: Check if `controlsRef.current` is not null before enabling
        if (controlsRef.current) {
          controlsRef.current.enabled = true;
        }
      }
    }
  });

  // ✅ Handle Arrow Clicks: Set New Target & Disable Controls During Transition
  const handleArrowClick = (arrowName: string) => {
    // ✅ FIX: Check if `controlsRef.current` is not null before disabling
    if (controlsRef.current) {
      controlsRef.current.enabled = false; // Disable user input during transition
    }

    switch (arrowName) {

      //
      // HOME
      //
      case "Arrow1": // Move to About Me
      setCameraTarget(Locations.about);
      setOrbitTarget(Targets.about);
      break;

      case "Arrow2": // Move to Resume
      setCameraTarget(Locations.resume1);
      setOrbitTarget(Targets.resume1);
      break;

      case "Arrow3": // Move to Resume
      setCameraTarget(Locations.projects);
      setOrbitTarget(Targets.projects);
      break;

      case "linkedin":
        window.open(Socials.LinkedIn)
        break;
      case "github":
        window.open(Socials.Github)
        break;
      case "gmail":
        window.location.href = 'mailto:${Socials.Gmail}';
        break;



      //
      //ABOUT ME 
      //
      
      case "BackArrow": // Back to Home Sign
        setCameraTarget(Locations.home);
        setOrbitTarget(Targets.home);
        break;

      //
      //RESUME
      //

      
      case "BackArrow_1": // Back to Home Sign
        setCameraTarget(Locations.home);
        setOrbitTarget(Targets.home);
        break;
      case "ResumeBack1_2": // Next Resume Section
        setCameraTarget(Locations.resume1);
        setOrbitTarget(Targets.resume1);
        break;
      case "ResumeNext1_1": //Next Resume Section 2
        setCameraTarget(Locations.resume2);
        setOrbitTarget(Targets.resume2);
        break;
      case "ResumeNext2_1": // Next Resume Section 3
        setCameraTarget(Locations.resume3);
        setOrbitTarget(Targets.resume3);
        break;
      case "ResumeBack2_2": // Back Resume Section 2
        setCameraTarget(Locations.resume2);
        setOrbitTarget(Targets.resume2);
        break;
      case "BackArrow001": // Back Resume Section 2
        setCameraTarget(Locations.home);
        setOrbitTarget(Targets.home);
        break;
      
      
        default:
        break;
    }
    setIsTransitioning(true);
  };

  return (
    <>
      {/* 🌅 Background & Lights */}
      <color attach="background" args={["lightblue"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 10]} />

      {/* 🔹 OrbitControls (Fixed Until Navigation) */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.1}
        maxPolarAngle={(Math.PI / 2) - 0.1} // Prevents looking under the floor
      />

      {/* 🏕️ Your Scene Elements */}
      <Sign onArrowClick={handleArrowClick} />
      <AboutMe onArrowClick={handleArrowClick} />
      <Resume onArrowClick={handleArrowClick} />
      <Projects onArrowClick={handleArrowClick} />
      <Ground />
      <SkyBackground />
    </>
  );
}
