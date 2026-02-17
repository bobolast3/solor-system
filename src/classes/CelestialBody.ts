import * as THREE from "three";
import { CelestialOptions } from "../types";

export class CelestialBody {
  name: string;
  radius: number;
  rotationPeriod: number;
  info: Record<string, any>;

  group: THREE.Group;
  mesh: THREE.Mesh;

  constructor(options: CelestialOptions) {
    this.name = options.name;
    this.radius = options.radius;
    this.rotationPeriod = options.rotationPeriod ?? 0;
    this.info = options.info ?? {};

    this.group = new THREE.Group();

    const texture = options.textureURL
      ? new THREE.TextureLoader().load(options.textureURL)
      : undefined;

    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius, 32, 32),
      new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.7,
        metalness: 0,
      }),
    );

    this.group.add(this.mesh);
  }

  update(deltaTime: number, speedFactor = 1) {
    if (this.rotationPeriod !== 0) {
      const speed = (2 * Math.PI) / (this.rotationPeriod * 3600);
      this.mesh.rotation.y += speed * deltaTime * speedFactor;
    }
  }

  getInfo() {
    return {
      name: this.name,
      radius: this.radius,
      rotationPeriod: this.rotationPeriod,
      ...this.info,
    };
  }
}
