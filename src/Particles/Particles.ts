import * as THREE from "three";

class Particles {
  scene: THREE.Scene;
  count: number;
  geometry: THREE.BufferGeometry | undefined;
  material: THREE.ShaderMaterial | undefined;
  points: THREE.Points | undefined;
  particleMaskTexture: HTMLImageElement | undefined;
  constructor(scene: THREE.Scene) {
    this.scene = scene;

    this.count = 2000;

    const image = new Image();
    image.src = "./assets/particleMask.png";
    image.addEventListener("load", () => {
      this.particleMaskTexture = image;
      this.setGeometry();
      this.setMaterial();
      this.setPoints();
    });
  }

  setGeometry() {
    this.geometry = new THREE.BufferGeometry();

    const positionArray = new Float32Array(this.count * 3);
    const progressArray = new Float32Array(this.count);
    const sizeArray = new Float32Array(this.count);
    const alphaArray = new Float32Array(this.count);

    for (let i = 0; i < this.count; i++) {
      positionArray[i * 3 + 0] = (Math.random() - 0.5) * 20;
      positionArray[i * 3 + 1] = 0;
      positionArray[i * 3 + 2] = (Math.random() - 0.5) * 10;

      progressArray[i] = Math.random();

      sizeArray[i] = Math.random();

      alphaArray[i] = Math.random();
    }

    this.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positionArray, 3)
    );
    this.geometry.setAttribute(
      "aProgress",
      new THREE.Float32BufferAttribute(progressArray, 1)
    );
    this.geometry.setAttribute(
      "aSize",
      new THREE.Float32BufferAttribute(sizeArray, 1)
    );
    this.geometry.setAttribute(
      "aAlpha",
      new THREE.Float32BufferAttribute(alphaArray, 1)
    );
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 25 },
        uProgressSpeed: { value: 0.000015 },
        uPerlinFrequency: { value: 0.17 },
        uPerlinMultiplier: { value: 1 },
        uMask: { value: this.particleMaskTexture },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uSize;
        uniform float uProgressSpeed;
        uniform float uPerlinFrequency;
        uniform float uPerlinMultiplier;
        
        attribute float aProgress;
        attribute float aSize;
        attribute float aAlpha;
        
        varying float vAlpha;
        
        #pragma glslify: perlin3d = require('../partials/perlin3d.glsl')
        
        void main() {
          float progress = mod(aProgress + uTime * uProgressSpeed, 1.0);
      
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          modelPosition.y += progress * 10.0;
          modelPosition.x += perlin3d((modelPosition.xyz + vec3(0.0, - uTime * 0.001, 0.0)) * uPerlinFrequency) * uPerlinMultiplier;
      
          vec4 viewPosition = viewMatrix * modelPosition;
          gl_Position = projectionMatrix * viewPosition;
      
          gl_PointSize = uSize * aSize;
          gl_PointSize *= (1.0 / - viewPosition.z);
      
          vAlpha = aAlpha;
        }
      `,
      fragmentShader: `
        uniform sampler2D uMask;
        varying float vAlpha;
        void main() {
          float maskStrength = texture2D(uMask, gl_PointCoord).r;
          gl_FragColor = vec4(1.0, 1.0, 1.0, maskStrength * vAlpha);
        }
      `,
    });
  }

  setPoints() {
    this.points = new THREE.Points(this.geometry, this.material);
    this.points.position.y = -5;
    this.scene.add(this.points);
  }

  update(time: { value: number }) {
    if (this.material) {
      this.material.uniforms["uTime"] = time;
    }
  }
}

export default Particles;
