"use client";

import React, { useState, useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { Sign } from "./sign";
import { AboutMe } from "./aboutme";
import { Resume } from "./resume";
import { Projects } from "./projects"
import { Ground } from "./ground";
import { SkyBackground } from "./skybackground";

export function Scene() {
  const { camera, size } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  //Locations
const Locations = {
  home: new THREE.Vector3(0, 5, 10),
  about: new THREE.Vector3(-100, 5, 20), //Bottom of structure
  about1: new THREE.Vector3(-98, 42, 5), //In the Room
  highlight1: new THREE.Vector3(-104.5, 41, -2), //Monument
  highlight2: new THREE.Vector3(-104.5, 41, -2), //Pictures
  highlight3: new THREE.Vector3(-103, 40, -7.5), //Volleyball
  highlight4: new THREE.Vector3(-95, 41, -5), //Computer
  projects: new THREE.Vector3(200, 7, 10),
  resume1: new THREE.Vector3(98, 8, 5),
  resume2: new THREE.Vector3(107, 8, 5),
  resume3: new THREE.Vector3(116, 8, 5),
}
const Targets = {
  home: new THREE.Vector3(0, 3, 0), 
  about: new THREE.Vector3(-100, 5, 0), //Bottom of structure
  about1: new THREE.Vector3(-99, 42, 0), //In the room
  highlight1: new THREE.Vector3(-108, 40, -2), //Monument
  highlight2: new THREE.Vector3(-104.5, 41, -2), //Pictures
  highlight3: new THREE.Vector3(-103, 30, -8), //Volleyball
  highlight4: new THREE.Vector3(-93.5, 40, -8), //Computer
  projects: new THREE.Vector3(200, 5, 0),
  resume1: new THREE.Vector3(98, 8, 0),
  resume2: new THREE.Vector3(107, 8, 0),
  resume3: new THREE.Vector3(116, 8, 0),
}

//Helper Function to make moving to locations easier

function moveToLocation(
  key: keyof typeof Locations,
  setCameraTarget: React.Dispatch<React.SetStateAction<THREE.Vector3>>,
  setOrbitTarget: React.Dispatch<React.SetStateAction<THREE.Vector3>>,
  setIsTransitioning: React.Dispatch<React.SetStateAction<boolean>>,
  controlsRef: React.RefObject<OrbitControlsImpl | null>
) {
  const newPosition = Locations[key];
  const newTarget = Targets[key];

  // Disable controls during move
  if (controlsRef.current) {
    controlsRef.current.enabled = false;
  }

  // Set new camera and orbit target
  setCameraTarget(newPosition);
  setOrbitTarget(newTarget);
  setIsTransitioning(true);
}


const Socials: Record<string, string> = {
  LinkedIn: "https://www.linkedin.com/in/benjamin-wierzbanowski/",
  Github: "https://github.com/bwierzbo",
  Gmail: "benjaminwierzbanowski@gmail.com"
}

  // 🎯 Camera & Target Positions
  const [cameraTarget, setCameraTarget] = useState(Locations.home);
  const [orbitTarget, setOrbitTarget] = useState(Targets.home);

  //Set Active focus to make certain things visable
  const [activeFocus, setActiveFocus] = useState<string | null>(null);


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
      controlsRef.current.target.set(0, 5, 0);
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
      moveToLocation("about", setCameraTarget, setOrbitTarget, setIsTransitioning, controlsRef)
      break;

      case "Arrow2": // Move to Resume
      moveToLocation("resume1", setCameraTarget, setOrbitTarget, setIsTransitioning, controlsRef)
      break;

      case "Arrow3": // Move to Resume
      moveToLocation("projects", setCameraTarget, setOrbitTarget, setIsTransitioning, controlsRef)
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

      case "Up": // Back to Home Sign
      moveToLocation("about1", setCameraTarget, setOrbitTarget, setIsTransitioning, controlsRef)
      break;
      
      case "Back": // Back to Home Sign
      moveToLocation("home", setCameraTarget, setOrbitTarget, setIsTransitioning, controlsRef)
      break;

      case "Down":
        moveToLocation("about", setCameraTarget, setOrbitTarget, setIsTransitioning, controlsRef)
        break;

      case "Monument":
      moveToLocation("highlight1", setCameraTarget, setOrbitTarget, setIsTransitioning, controlsRef)
      setActiveFocus("monument")
      break;

      case "MonumentBack":
      moveToLocation("about1", setCameraTarget, setOrbitTarget, setIsTransitioning, controlsRef)
      setActiveFocus(null)
      break;

      case "Volleyball":
      moveToLocation("highlight3", setCameraTarget, setOrbitTarget, setIsTransitioning, controlsRef)
      setActiveFocus("volleyball")
      break;

      case "VolleyballBack":
      moveToLocation("about1", setCameraTarget, setOrbitTarget, setIsTransitioning, controlsRef)
      setActiveFocus(null)
      break;

      case "Pictures":
      moveToLocation("highlight2", setCameraTarget, setOrbitTarget, setIsTransitioning, controlsRef)
      setActiveFocus("photos")
      break;

      case "PicturesBack":
      moveToLocation("about1", setCameraTarget, setOrbitTarget, setIsTransitioning, controlsRef)
      setActiveFocus(null)
      break;
      
      case "Screen":
      moveToLocation("highlight4", setCameraTarget, setOrbitTarget, setIsTransitioning, controlsRef)
      setActiveFocus("computer")
      break;
  
      case "ComputerBack":
      moveToLocation("about1", setCameraTarget, setOrbitTarget, setIsTransitioning, controlsRef)
      setActiveFocus(null)
      break;

      //
      //RESUME
      //

      
      case "BackArrow_1": // Back to Home Sign
      moveToLocation("home", setCameraTarget, setOrbitTarget, setIsTransitioning, controlsRef)
      break;

      case "ResumeBack1_2": // Next Resume Section
      moveToLocation("resume1", setCameraTarget, setOrbitTarget, setIsTransitioning, controlsRef)
      break;

      case "ResumeNext1_1": //Next Resume Section 2
      moveToLocation("resume2", setCameraTarget, setOrbitTarget, setIsTransitioning, controlsRef)
      break;

      case "ResumeNext2_1": // Next Resume Section 3
      moveToLocation("resume3", setCameraTarget, setOrbitTarget, setIsTransitioning, controlsRef)
      break;

      case "ResumeBack2_2": // Back Resume Section 2
      moveToLocation("resume2", setCameraTarget, setOrbitTarget, setIsTransitioning, controlsRef)
      break;

      case "BackArrow001": // Back Resume Section 2
      moveToLocation("home", setCameraTarget, setOrbitTarget, setIsTransitioning, controlsRef)
      break;
      
        default:
        break;
    }
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
      <AboutMe onArrowClick={handleArrowClick} activeFocus={activeFocus}/>
      <Resume onArrowClick={handleArrowClick} />
      <Projects onArrowClick={handleArrowClick} />
      <Ground />
      <SkyBackground />
    </>
  );
}
