import { useLoader } from "@react-three/fiber";
import { TextureLoader, RepeatWrapping } from "three";

export function Ground() {
  // Load textures
  const grassTexture = useLoader(TextureLoader, "/textures/grass.jpg");
  //const normalMap = useLoader(TextureLoader, "/textures/grass_normal.jpg");
  const roughnessMap = useLoader(TextureLoader, "/textures/grass_rough.jpg");

  // Set textures to tile across the floor
  grassTexture.wrapS = grassTexture.wrapT = RepeatWrapping;
  //normalMap.wrapS = normalMap.wrapT = RepeatWrapping;
  roughnessMap.wrapS = roughnessMap.wrapT = RepeatWrapping;

  grassTexture.repeat.set(10, 10);
  //normalMap.repeat.set(10, 10);
  roughnessMap.repeat.set(10, 10);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[500, 500]} />
      <meshStandardMaterial
        map={grassTexture}
        //normalMap={normalMap}
        roughnessMap={roughnessMap}
        roughness={0.8}
      />
    </mesh>
  );
}
