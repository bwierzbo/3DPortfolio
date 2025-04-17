"use client";

import React, { useRef } from "react";
import { useLoader, ThreeEvent } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Mesh } from "three";
import { useFocusVisibility } from "../hooks/useFocusVisibility"; // adjust path if needed

interface Props {
  onArrowClick?: (arrowName: string) => void;
  activeFocus: string | null;
}

export function AboutMe({ onArrowClick, activeFocus }: Props) {
  const fileUrl = "/AboutMe.glb";
  const meshRef = useRef<Mesh>(null!);
  const gltf = useLoader(GLTFLoader, fileUrl);

  // Apply visibility logic using the custom hook
  useFocusVisibility(gltf.scene, {
    monument: ["MonumentText", "MonumentBack"],
    volleyball: ["VolleyballText", "VolleyballBack"],
    computer: ["ComputerInfo", "ComputerBack"],
    photos: ["PhotoText", "PhotoHighlight"]
  }, activeFocus);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const clickedObject = e.object;  // The specific sub-mesh

    console.log("Clicked mesh:", clickedObject.name);
    if (onArrowClick) {
      onArrowClick(e.object.name);
    }
  };

  return (
    <mesh ref={meshRef} position={[-100, 0, 0]}>
      <primitive object={gltf.scene} onPointerDown={handlePointerDown} />
    </mesh>
  );
}
