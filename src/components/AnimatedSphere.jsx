import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function AnimatedSphere() {
  const meshRef = useRef();

  useFrame(() => {
    const mesh = meshRef.current;
    mesh.rotation.y += 0.01;
    mesh.material.emissiveIntensity = (1 + Math.sin(Date.now() * 0.001)) * 0.5;
    // change color to green with sin wave
    mesh.material.color = new THREE.Color('green');
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 32, 32]} /> {/* Increased radius to 5 */}
      <meshStandardMaterial color="blue" emissive="blue" wireframe />
    </mesh>
  );
}

function Scene() {
  return (

    <Canvas style={{ width: '100vw', height: '100vh', background: 'black' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} />
      <AnimatedSphere />
      <camera position={[0, 0, 0]} /> {/* Adjusted camera position for better view */}
    </Canvas>



  );
}

export default Scene;
