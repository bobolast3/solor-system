import * as THREE from "three";
import { CelestialBody } from "./CelestialBody";

import { PlanetInfo } from "../types";

export interface SunOptions {
  name: string;
  radius: number;
  rotationPeriod?: number;
  textureURL?: string;
  lightIntensity?: number;
  info: PlanetInfo;
}

export class Sun extends CelestialBody {
  light: THREE.PointLight;

  constructor(options: SunOptions) {
    // Preload texture first
    let sunTexture: THREE.Texture | undefined;
    if (options.textureURL) {
      sunTexture = new THREE.TextureLoader().load(options.textureURL);
    }

    super({
      ...options,
      textureURL: options.textureURL,
    });

    // ---- Light source ----

    // Add point light for illumination
    this.light = new THREE.PointLight(
      0xffffff,
      options.lightIntensity || 2,
      1000,
    );
    this.group.add(this.light);

    if (options.textureURL) {
      (this.mesh.material as THREE.MeshStandardMaterial).emissive =
        new THREE.Color(0xffffff);
      (this.mesh.material as THREE.MeshStandardMaterial).emissiveMap =
        new THREE.TextureLoader().load(options.textureURL);
      (this.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity =
        1.5;
    }
  }

  update(deltaTime: number, speedFactor = 1) {
    if (this.rotationPeriod && this.rotationPeriod > 0) {
      const rotationSpeed = (2 * Math.PI) / (this.rotationPeriod * 86400);
      this.mesh.rotation.y += rotationSpeed * deltaTime * speedFactor;
    }
  }
}
