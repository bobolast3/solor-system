import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

import { Planet } from "../classes/Planet";
import { Sun } from "../classes/Sun";
import { StarField } from "../classes/StarField";
import { planetsData, sunData } from "../input";
import { InfoPanel } from "./Panel";
import { InstructionsOverlay } from "./InstructionOverlay";

export default function Scene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedBody, setSelectedBody] = useState<null | Record<string, any>>(
    null,
  );
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ----- Scene and Camera -----
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 20, 50);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    scene.add(new THREE.AmbientLight(0xffffff, 0.15));

    // ----- GUI -----
    const params = {
      speedFactor: 483712,
      starCount: 4000,
      starRadius: 100,
    };
    const gui = new GUI();
    gui.add(params, "speedFactor", 0, 1000000, 1);
    gui.add(params, "starCount", 100, 5000, 100).onFinishChange(rebuildStars);
    gui.add(params, "starRadius", 50, 500, 10).onFinishChange(rebuildStars);

    // ----- Sun -----
    const sun = new Sun(sunData);
    scene.add(sun.group);

    // ----- Planets -----
    const planets: Planet[] = planetsData.map((data) => new Planet(data));
    planets.forEach((p) => {
      scene.add(p.group);
      p.createOrbitLine(scene);
    });

    // Add planets + create orbit lines
    planets.forEach((p) => {
      scene.add(p.group);
      p.createOrbitLine(scene);
    });

    // ----- Stars -----
    let stars = new StarField({
      count: params.starCount,
      radius: params.starRadius,
      seed: 42,
    });
    scene.add(stars.points);

    function rebuildStars() {
      stars.dispose(scene);
      stars = new StarField({
        count: params.starCount,
        radius: params.starRadius,
      });
      scene.add(stars.points);
    }

    // ----- Raycaster -----
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onClick(event: MouseEvent) {
      if (!mount) return;
      const rect = mount.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const objects = [sun.mesh, ...planets.map((p) => p.mesh)];
      const intersects = raycaster.intersectObjects(objects);

      if (intersects.length > 0) {
        const obj = intersects[0].object as THREE.Mesh;
        // find which body
        if (obj === sun.mesh) setSelectedBody(sun.getInfo());
        else {
          const planet = planets.find((p) => p.mesh === obj);
          if (planet) setSelectedBody(planet.getInfo());
        }
        setHasInteracted(true);
      } else {
        setSelectedBody(null);
        setHasInteracted(false);
      }
    }

    mount.addEventListener("click", onClick);

    // ----- Animate -----
    let lastTime = performance.now();
    const animate = () => {
      const currentTime = performance.now();
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      sun.update(deltaTime, params.speedFactor);

      planets.forEach((p) => p.update(deltaTime, params.speedFactor));
      stars.update(deltaTime, params.speedFactor);

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      gui.destroy();
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />

      {selectedBody && <InfoPanel body={selectedBody} />}
      {!hasInteracted && <InstructionsOverlay />}
    </>
  );
}
