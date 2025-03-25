import { Sky } from "@react-three/drei";

export function SkyBackground() {
  return (
    <Sky
      distance={4500} // Far background effect
      sunPosition={[100, 100, 100]} // Sunlight position
      inclination={0.5} // Adjusts sunset/sunrise effect
      azimuth={0.25} // Adjusts direction of the sun
    />
  );
}
