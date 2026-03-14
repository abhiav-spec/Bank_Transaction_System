import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function FloatingShape({ position, color }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x += 0.002;
    ref.current.rotation.y += 0.003;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
  });

  return (
    <mesh ref={ref} position={position}>
      <icosahedronGeometry args={[0.7, 0]} />
      <meshStandardMaterial color={color} transparent opacity={0.35} />
    </mesh>
  );
}

export default function ThreeBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 opacity-80">
      <Canvas camera={{ position: [0, 0, 6], fov: 55 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#22d3ee" />
        <FloatingShape position={[-2.5, 1, -1]} color="#22d3ee" />
        <FloatingShape position={[0.5, -1, -2]} color="#60a5fa" />
        <FloatingShape position={[2.7, 0.8, -1.5]} color="#a78bfa" />
      </Canvas>
    </div>
  );
}
