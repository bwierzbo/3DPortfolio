import React from "react";
import { ThreeElements } from "@react-three/fiber";

export function Floor(props: ThreeElements["mesh"]) {
  return (
    <mesh 
      {...props} 
      rotation={[-Math.PI / 2, 0, 0]} 
      receiveShadow
    >
      <planeGeometry args={[1000, 100]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}
