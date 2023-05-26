import { useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Particles from "./Particles/Particles";
import Time from "./Time";
import "./App.css";

export default function App() {
  const [isInitScene, setIsInitScene] = useState<boolean>(false);

  useEffect(() => {
    if (!isInitScene) {
      setIsInitScene(true);
      initScene();
    }
  }, []);

  const initScene = async () => {
    const time = new Time();
    const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("canvas.webgl")!,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0.0);
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    let particles = new Particles(scene);

    function animate() {
      requestAnimationFrame(animate);

      time.tick();

      particles.update({
        value: time.value(),
      });
      renderer.setClearColor(0x000000);
      renderer.render(scene, camera);
    }

    animate();
  };

  return (
    <div className="App">
      <canvas
        className="webgl"
        style={{ width: "100%", height: "100%" }}
      ></canvas>
    </div>
  );
}
