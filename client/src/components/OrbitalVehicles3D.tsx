import { useRef, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

// Vehicle image URLs - Now using transparent background versions
const VEHICLE_IMAGES = {
  escalade: "/vehicles/escalade-transparent.png",
  sclass: "/vehicles/mercedes-s-transparent.png",
};

// Realistic Vehicle Sprite Component
function VehicleSprite({ 
  imageUrl, 
  scale = [3, 2, 1] as [number, number, number],
  position = [0, 0, 0] as [number, number, number]
}: { 
  imageUrl: string; 
  scale?: [number, number, number];
  position?: [number, number, number];
}) {
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  
  // Configure texture for better quality
  useMemo(() => {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);

  return (
    <group position={position}>
      {/* Main vehicle sprite - optimized for transparent backgrounds */}
      <mesh>
        <planeGeometry args={scale} />
        <meshBasicMaterial 
          map={texture} 
          transparent 
          side={THREE.DoubleSide}
          alphaTest={0.01}
          depthWrite={true}
          premultipliedAlpha={true}
        />
      </mesh>
      
      {/* Shadow plane underneath - subtle depth effect */}
      <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[scale[0] * 0.35, 32]} />
        <meshBasicMaterial 
          color="#000000" 
          transparent 
          opacity={0.25}
          depthWrite={false}
          blending={THREE.MultiplyBlending}
          premultipliedAlpha={true}
        />
      </mesh>
      
      {/* Ambient glow for luxury effect */}
      <pointLight 
        position={[0, -0.3, 0]} 
        color="#60a5fa" 
        intensity={1.2}
        distance={4}
        decay={2}
      />
    </group>
  );
}

// Circular Road/Path around the orb
function CircularRoad({ radius }: { radius: number }) {
  const points = useMemo(() => {
    const curve = new THREE.EllipseCurve(
      0, 0,
      radius, radius,
      0, 2 * Math.PI,
      false,
      0
    );
    return curve.getPoints(128);
  }, [radius]);

  const geometry = useMemo(() => {
    const shape = new THREE.Shape(points);
    const holeRadius = radius - 0.3;
    const hole = new THREE.Path();
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      hole.lineTo(
        Math.cos(angle) * holeRadius,
        Math.sin(angle) * holeRadius
      );
    }
    shape.holes.push(hole);
    
    const geom = new THREE.ShapeGeometry(shape, 64);
    return geom;
  }, [points, radius]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <primitive object={geometry} />
      <meshStandardMaterial 
        color="#1a1a2e" 
        transparent 
        opacity={0.15}
        metalness={0.8}
        roughness={0.2}
        emissive="#3b82f6"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

// Planetary Ring Orbital Vehicle - Flat Saturn-style animation
function OrbitalVehicle({ 
  imageUrl,
  vehicleScale,
  radius, 
  speed, 
  offset,
}: { 
  imageUrl: string;
  vehicleScale: [number, number, number];
  radius: number;
  speed: number;
  offset: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime() * speed + offset;
      
      // Calculate position on circular path
      const x = Math.cos(time) * radius;
      const z = Math.sin(time) * radius;
      
      groupRef.current.position.x = x;
      groupRef.current.position.z = z;
      // All vehicles stay in the SAME flat horizontal plane (Saturn's rings)
      groupRef.current.position.y = 0;
      
      // Face direction of travel (tangent to circle)
      const angle = -time + Math.PI / 2;
      groupRef.current.rotation.y = angle;
      
      // Extremely subtle banking - barely perceptible for elegance
      const speedFactor = Math.abs(speed);
      const bankAngle = Math.sin(time * 1.5) * 0.008 * speedFactor;
      groupRef.current.rotation.z = bankAngle;
      
      // NO bounce - perfectly flat orbit
      // NO pitch - maintain horizontal alignment
      // Clean, organized, Saturn-like ring pattern
    }
  });
  
  return (
    <group ref={groupRef}>
      <VehicleSprite imageUrl={imageUrl} scale={vehicleScale} />
    </group>
  );
}

// Main 3D Scene Component
function OrbitalScene() {
  return (
    <>
      {/* Enhanced lighting for realistic vehicle appearance */}
      <ambientLight intensity={0.6} />
      
      {/* Main directional light */}
      <directionalLight 
        position={[15, 20, 10]} 
        intensity={2}
        color="#ffffff"
      />
      
      {/* Fill lights from different angles */}
      <directionalLight position={[-10, 10, -5]} intensity={1} color="#93c5fd" />
      <directionalLight position={[0, 10, -15]} intensity={0.8} color="#60a5fa" />
      
      {/* Hemisphere light for natural ambient */}
      <hemisphereLight args={["#ffffff", "#1e3a8a", 0.5]} />
      
      {/* Circular roads/paths at different radii */}
      <CircularRoad radius={6.5} />
      <CircularRoad radius={4.5} />
      
      {/* OUTER RING: Cadillac Escalades - Two vehicles opposite each other */}
      <OrbitalVehicle 
        imageUrl={VEHICLE_IMAGES.escalade}
        vehicleScale={[4, 2.8, 1]}
        radius={6.5} 
        speed={-0.35} 
        offset={0}
      />
      <OrbitalVehicle 
        imageUrl={VEHICLE_IMAGES.escalade}
        vehicleScale={[4, 2.8, 1]}
        radius={6.5} 
        speed={-0.35} 
        offset={Math.PI}
      />
      
      {/* INNER RING: Mercedes S-Class Sedans - Two vehicles perpendicular */}
      <OrbitalVehicle 
        imageUrl={VEHICLE_IMAGES.sclass}
        vehicleScale={[3.5, 2.5, 1]}
        radius={4.5} 
        speed={0.45} 
        offset={Math.PI / 2}
      />
      <OrbitalVehicle 
        imageUrl={VEHICLE_IMAGES.sclass}
        vehicleScale={[3.5, 2.5, 1]}
        radius={4.5} 
        speed={0.45} 
        offset={-Math.PI / 2}
      />
      
      {/* Additional atmospheric lighting */}
      <pointLight position={[0, 5, 0]} color="#60a5fa" intensity={0.5} distance={20} />
    </>
  );
}

// Main export component
export default function OrbitalVehicles3D() {
  return (
    <div 
      className="absolute pointer-events-none w-[500px] h-[500px] md:w-[700px] md:h-[700px]" 
      style={{ 
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 5,
      }}
    >
      <Canvas
        camera={{ position: [0, 18, 25], fov: 45 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
      >
        <OrbitalScene />
      </Canvas>
    </div>
  );
}
