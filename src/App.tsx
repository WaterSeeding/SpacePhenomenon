import { useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Particles from "./Particles/Particles";
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
      40,
      window.innerWidth / window.innerHeight,
      1,
      200
    );
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;

    let particles = new Particles(scene);

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();

      controls.update();

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
