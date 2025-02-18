"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./components/scene";

export default function App() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Canvas camera={{ position: [0, 2, 10] }}>
        <Scene />
      </Canvas>
    </div>
  );
}
