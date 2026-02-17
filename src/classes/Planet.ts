import * as THREE from "three";
import { CelestialBody } from "./CelestialBody";
import { PlanetOptions } from "../types";

export class Planet extends CelestialBody {
  distance: number;
  orbitPeriod: number;
  orbitAngle = 0;

  moons: Planet[] = [];
  orbitLine?: THREE.Line;

  constructor(options: PlanetOptions) {
    super(options);

    this.distance = options.distance;
    this.orbitPeriod = options.orbitPeriod;

    // Rings
    if (options.ring) {
      const tex = options.ring.textureURL
        ? new THREE.TextureLoader().load(options.ring.textureURL)
        : undefined;

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(
          options.ring.innerRadius,
          options.ring.outerRadius,
          64,
        ),
        new THREE.MeshStandardMaterial({
          map: tex,
          transparent: true,
          side: THREE.DoubleSide,
        }),
      );
      ring.rotation.x = -Math.PI / 2;
      this.group.add(ring);
    }

    // Moons
    options.moons?.forEach((m) => {
      const moon = new Planet({
        name: m.name,
        radius: m.radius,
        distance: m.distance,
        orbitPeriod: m.orbitPeriod,
        rotationPeriod: m.rotationPeriod,
        textureURL: m.textureURL,
      });
      this.moons.push(moon);
      this.group.add(moon.group);
    });
  }

  createOrbitLine(scene: THREE.Scene) {
    if (this.orbitLine) return;

    const points: THREE.Vector3[] = [];
    const segments = 128;

    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          this.distance * Math.cos(t),
          0,
          this.distance * Math.sin(t),
        ),
      );
    }

    this.orbitLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({
        color: 0xffffff,
        opacity: 0.25,
        transparent: true,
      }),
    );

    scene.add(this.orbitLine);
  }

  update(deltaTime: number, speedFactor = 1) {
    super.update(deltaTime, speedFactor);

    const orbitSpeed = (2 * Math.PI) / (this.orbitPeriod * 86400);

    this.orbitAngle += orbitSpeed * deltaTime * speedFactor;

    this.group.position.set(
      this.distance * Math.cos(this.orbitAngle),
      0,
      this.distance * Math.sin(this.orbitAngle),
    );

    this.moons.forEach((m) => m.update(deltaTime, speedFactor));
  }
}
