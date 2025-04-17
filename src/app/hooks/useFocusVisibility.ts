import { useEffect } from "react";
import * as THREE from "three";

/**
 * Automatically toggles visibility of named child meshes based on activeFocus.
 * @param scene - GLTF scene root
 * @param focusMap - Map of focus names to mesh names in the scene
 * @param activeFocus - The current focus name (e.g. "monument")
 */
export function useFocusVisibility(
  scene: THREE.Group,
  focusMap: Record<string, string[]>,
  activeFocus: string | null
) {
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      for (const [focusKey, meshNames] of Object.entries(focusMap)) {
        if (meshNames.includes(child.name)) {
          child.visible = activeFocus === focusKey;
        }
      }
    });
  }, [scene, focusMap, activeFocus]);
}
