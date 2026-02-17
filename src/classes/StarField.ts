import * as THREE from "three";
import { StarFieldOptions } from "../types";

export class StarField {
  points: THREE.Points;
  geometry: THREE.BufferGeometry;
  material: THREE.ShaderMaterial;

  private time = 0;

  constructor({
    count = 2000,
    radius = 500,
    minSize = 1.0,
    maxSize = 3.0,
    colors = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xffddaa),
      new THREE.Color(0xaaccff),
      new THREE.Color(0xffaaaa),
    ],
    seed = 1,
  }: StarFieldOptions = {}) {
    const geometry = new THREE.BufferGeometry();

    // Seeded RNG
    let random = seed;
    const rand = () => {
      random = (random * 9301 + 49297) % 233280;
      return random / 233280;
    };

    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colorArray = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);

      const r = radius;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions.set([x, y, z], i * 3);

      // Random size per star
      sizes[i] = THREE.MathUtils.lerp(minSize, maxSize, rand());

      // Random color per star
      const color = colors[Math.floor(rand() * colors.length)];
      colorArray.set([color.r, color.g, color.b], i * 3);
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));

    this.geometry = geometry;

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float uTime;

        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

          // subtle twinkle effect
          float twinkle = 0.85 + 0.15 * sin(uTime + position.x * 10.0);
          gl_PointSize = size * twinkle * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;

        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          float a = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(vColor, a);
        }
      `,
      transparent: true,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(this.geometry, this.material);
  }

  update(deltaTime: number, speedFactor = 1) {
    this.time += deltaTime * Math.min(speedFactor * 0.00001, 0.02);
    this.material.uniforms.uTime.value = this.time;
  }

  dispose(scene: THREE.Scene) {
    scene.remove(this.points);
    this.geometry.dispose();
    this.material.dispose();
  }
}
