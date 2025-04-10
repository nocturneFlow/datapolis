// components/ThreeBackground.tsx
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useMemo } from "react";

const Particles = () => {
  const ref = useRef<THREE.Points>(null);

  // Генерация точек
  const count = 500;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  // Анимация вращения
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0015;
    }
  });

  return (
    <group>
      <Points ref={ref} positions={positions} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#2563EB"
          size={0.05}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const ThreeBackground = () => {
  return (
    <Canvas
      className="absolute inset-0 z-0"
      camera={{ position: [0, 0, 5], fov: 75 }}
    >
      <ambientLight intensity={0.5} />
      <Particles />
      <Preload all />
    </Canvas>
  );
};

export default ThreeBackground;
