"use client";

import React, { useRef } from "react";
import { useLoader, ThreeEvent } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Mesh } from "three";


interface Props {
    // Callback to notify parent about which arrow was clicked
    onArrowClick?: (aboutArrow: string) => void;
  }

export function Projects({ onArrowClick }: Props) {
  const fileUrl = "/Projectsv2.glb"; // Make sure this is in /public
  const meshRef = useRef<Mesh>(null!);

  const gltf = useLoader(GLTFLoader, fileUrl);
  

  
  // Handle pointer down on any sub-mesh
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const clickedObject = e.object;  // The specific sub-mesh

    console.log("Clicked mesh:", clickedObject.name);
    if (onArrowClick) {
      onArrowClick(clickedObject.name);
    }
  };

  return (

    <mesh ref={meshRef} position={[200, 0, 0]}>
      {/* Attach the event handler to the entire gltf.scene so sub-mesh clicks bubble up */}
      <primitive object={gltf.scene} onPointerDown={handlePointerDown} />
    </mesh>
  );
}
