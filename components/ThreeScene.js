"use client"; // Required for Next.js App Router
import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const Model = ({ containerSize, onButtonClick }) => {
  const { scene, cameras } = useGLTF('/models/model.gltf');
  const modelRef = useRef();
  const buttonRef = useRef(null);
  const heartRef = useRef(null);

  // Find button and heart meshes
  useEffect(() => {
    scene.traverse((child) => {
      if (child.name.toLowerCase().includes("button")) {
        buttonRef.current = child;
      }
      if (child.name.toLowerCase().includes("heartt")) {
        heartRef.current = child;
        child.userData.originalColor = child.material.color.clone();
      }
    });
  }, [scene]);

  // Scale and center model
  useEffect(() => {
    if (!modelRef.current || !containerSize.width || !containerSize.height) return;
    const box = new THREE.Box3().setFromObject(modelRef.current);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = Math.min(containerSize.width / maxDim, containerSize.height / maxDim) * 0.9;
    modelRef.current.scale.set(scale, scale, scale);
  }, [containerSize]);

  useFrame((state) => {
    if (modelRef.current) {
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const center = box.getCenter(new THREE.Vector3());
      modelRef.current.position.sub(center); // Center model

      // Update camera lookAt
      state.camera.lookAt(0, 0, 0); // Targets model center
    }

    // Blinking effect for heart
    if (heartRef.current && heartRef.current.userData.isBlinking) {
      const elapsed = Date.now() - heartRef.current.userData.blinkStartTime;
      if (elapsed < 1500) {
        const blinkFrequency = 4;
        const shouldBeWhite = Math.sin(state.clock.getElapsedTime() * blinkFrequency * Math.PI) > 0;
        heartRef.current.material.color.set(
          shouldBeWhite ? 0x000000 : heartRef.current.userData.originalColor
        );
      } else {
        heartRef.current.material.color.copy(heartRef.current.userData.originalColor);
        heartRef.current.userData.isBlinking = false;
      }
    }
  });

  return (
    <group ref={modelRef} onClick={(e) => {
      if (e.object === buttonRef.current || (e.object.isMesh && e.object.parent === buttonRef.current)) {
        if (heartRef.current) {
          heartRef.current.userData.isBlinking = true;
          heartRef.current.userData.blinkStartTime = Date.now();
          setTimeout(() => {
            window.location.href = ""; // Replace with your URL
          }, 1500);
        }
        onButtonClick();
      }
    }}>
      <primitive object={scene} />
    </group>
  );
};

const ThreeScene = ({ containerSize }) => {
  const { cameras } = useGLTF('/models/model.gltf');
  const perspectiveCamera = cameras.find((cam) => cam.name === 'PerspectiveCamera');

  return (
    <Canvas
      camera={
        perspectiveCamera || { position: [0, 0, 5], fov: 50 } // Fallback if no GLTF camera
      }
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.7} />
      {containerSize.width && containerSize.height && (
        <Model containerSize={containerSize} onButtonClick={() => console.log('Button clicked')} />
      )}
      <OrbitControls enableRotate={false} enableZoom={false} enablePan={false} />
    </Canvas>
  );
};

export default ThreeScene;