"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { ScrollTrigger, useGSAP, registerGsap } from "@/lib/gsap";

type FilmProgress = { p: number };

const GOLD = "#ca8a04";
const CREAM = "#faf8f0";
const BG = "#141210";

const SDLC = ["Plan", "Design", "Build", "Test", "Deploy", "Scale"] as const;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function CameraRig({ film }: { film: React.MutableRefObject<FilmProgress> }) {
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const p = film.current.p;
    const mx = state.pointer.x * 0.2;
    const my = state.pointer.y * 0.12;

    let x = 0.15 + mx;
    let y = 0.45 + my;
    let z = 9.2;
    let lookY = 0.1;

    if (p < 0.2) {
      const t = smoothstep(0, 0.2, p);
      // Stay wide so center corridor stays open for mountain name
      x = lerp(0.15, 0.05, t) + mx;
      y = lerp(0.45, 0.3, t) + my;
      z = lerp(9.2, 7.2, t);
      lookY = lerp(0.1, 0.05, t);
    } else if (p < 0.45) {
      const t = smoothstep(0.2, 0.45, p);
      const angle = t * Math.PI * 1.1;
      x = Math.sin(angle) * 5.2 + mx;
      y = lerp(0.35, 1.4, t) + my;
      z = Math.cos(angle) * 5.2 + 0.8;
      lookY = 0.2;
    } else if (p < 0.7) {
      const t = smoothstep(0.45, 0.7, p);
      x = lerp(5.2, -1.2, t) + mx * 0.5;
      y = lerp(1.4, 0.05, t);
      z = lerp(5.8, 2.1, t);
    } else {
      const t = smoothstep(0.7, 1, p);
      x = lerp(-1.2, 0.2, t) + mx * 0.25;
      y = lerp(0.05, 0.4, t);
      z = lerp(2.1, 7.2, t);
    }

    target.set(x, y, z);
    state.camera.position.lerp(target, 0.09);
    state.camera.lookAt(0, lookY, 0);
  });

  return null;
}

function StackBlock({
  size,
  y,
  emissive = 0.12,
}: {
  size: number;
  y: number;
  emissive?: number;
}) {
  const geo = useMemo(() => new THREE.BoxGeometry(size, 0.22, size * 0.92), [size]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);

  return (
    <group position={[0, y, 0]}>
      {/* glass plate */}
      <mesh geometry={geo}>
        <meshPhysicalMaterial
          color="#0c0c0c"
          metalness={0.95}
          roughness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive={GOLD}
          emissiveIntensity={emissive}
          transparent
          opacity={0.92}
        />
      </mesh>
      {/* gold wire frame */}
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={GOLD} transparent opacity={0.9} />
      </lineSegments>
      {/* thin gold accent strip on top face */}
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 0.22, size * 0.28, 32]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function HashStack({
  film,
  position,
  scale = 1,
  phase = 0,
  label,
}: {
  film: React.MutableRefObject<FilmProgress>;
  position: [number, number, number];
  scale?: number;
  phase?: number;
  label?: string;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = film.current.p;
    if (!group.current) return;
    group.current.rotation.y = t * (0.12 + phase * 0.03) + p * Math.PI * 0.55;
    group.current.rotation.x = 0.18 + Math.sin(t * 0.22 + phase) * 0.06;
    const pop = lerp(1, 1.15, smoothstep(0, 0.3, p));
    group.current.position.z = position[2];
    group.current.scale.setScalar(scale * pop);
  });

  // Slim modern floating plates (not chunky brown cubes)
  const layers = [
    { y: -0.7, size: 1.35, e: 0.12 },
    { y: -0.35, size: 1.1, e: 0.18 },
    { y: 0.0, size: 0.88, e: 0.24 },
    { y: 0.35, size: 0.66, e: 0.32 },
    { y: 0.68, size: 0.42, e: 0.45 },
  ];

  return (
    <group ref={group} position={position}>
      {layers.map((l, i) => (
        <StackBlock key={i} y={l.y} size={l.size} emissive={l.e} />
      ))}
      <mesh position={[0, 0.95, 0]}>
        <octahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial
          color={GOLD}
          metalness={1}
          roughness={0.08}
          emissive={GOLD}
          emissiveIntensity={1}
        />
      </mesh>
      {label && (
        <Html position={[0, -1.2, 0]} center distanceFactor={9} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded-md border border-[#ca8a04]/45 bg-[#0a0908]/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-[#faf8f0] shadow-[0_0_16px_rgba(202,138,4,0.2)] backdrop-blur-sm">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

function SdlcRing({ film }: { film: React.MutableRefObject<FilmProgress> }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = film.current.p;
    if (!group.current) return;
    group.current.rotation.y = -t * 0.1 - p * 0.7;
    const appear = smoothstep(0.42, 0.62, p);
    group.current.scale.setScalar(appear * (1 + Math.sin(smoothstep(0.6, 0.85, p) * Math.PI) * 0.15));
    group.current.visible = appear > 0.08;
  });

  return (
    <group ref={group}>
      {/* Outer thin ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[5.4, 0.018, 12, 128]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.5} />
      </mesh>
      {/* Inner dashed feel via second thinner ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.55, 0.008, 8, 96]} />
        <meshBasicMaterial color={CREAM} transparent opacity={0.12} />
      </mesh>

      {SDLC.map((label, i) => {
        const a = (i / SDLC.length) * Math.PI * 2;
        const r = 5.4;
        const x = Math.cos(a) * r;
        const z = Math.sin(a) * r;
        const num = String(i + 1).padStart(2, "0");
        return (
          <group key={label} position={[x, Math.sin(a * 2) * 0.2, z]}>
            {/* Node core */}
            <mesh>
              <sphereGeometry args={[0.16, 24, 24]} />
              <meshStandardMaterial
                color="#0a0a0a"
                metalness={0.9}
                roughness={0.15}
                emissive={GOLD}
                emissiveIntensity={0.4}
              />
            </mesh>
            <mesh>
              <ringGeometry args={[0.22, 0.28, 32]} />
              <meshBasicMaterial color={GOLD} transparent opacity={0.7} side={THREE.DoubleSide} />
            </mesh>
            <Html
              position={[0, 0.55, 0]}
              center
              distanceFactor={11}
              style={{ pointerEvents: "none" }}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="font-[family-name:var(--font-mono)] text-[8px] font-medium tracking-[0.18em] text-[#ca8a04]/70">
                  {num}
                </span>
                <div className="rounded-md border border-[#ca8a04]/35 bg-[#0a0908]/85 px-2.5 py-1 backdrop-blur-md shadow-[0_0_20px_rgba(202,138,4,0.15)]">
                  <span className="whitespace-nowrap font-[family-name:var(--font-display)] text-[9px] font-bold uppercase tracking-[0.22em] text-[#faf8f0]">
                    {label}
                  </span>
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

function FloatingOrbs({ film }: { film: React.MutableRefObject<FilmProgress> }) {
  const items = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        phase: i,
        // Keep orbs on the sides — leave center open for name
        radius: 3.4 + (i % 4) * 0.55,
        speed: 0.16 + (i % 4) * 0.04,
        size: 0.1 + (i % 3) * 0.05,
        y: ((i % 7) - 3) * 0.32,
      })),
    [],
  );

  return (
    <>
      {items.map((item) => (
        <Orb key={item.phase} {...item} film={film} />
      ))}
    </>
  );
}

function Orb({
  phase,
  radius,
  speed,
  size,
  y,
  film,
}: {
  phase: number;
  radius: number;
  speed: number;
  size: number;
  y: number;
  film: React.MutableRefObject<FilmProgress>;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const p = film.current.p;
    const a = t * speed + phase * 0.7;
    const explode = smoothstep(0.55, 0.9, p);
    ref.current.position.set(
      Math.cos(a) * radius * (1 + explode * 0.8),
      y + Math.sin(t * 0.6 + phase) * 0.25,
      Math.sin(a) * radius * (1 + explode) - explode * 4,
    );
    ref.current.rotation.x = t * 0.8;
    ref.current.rotation.y = t * 0.5;
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[size, 0]} />
      <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.7} metalness={0.9} roughness={0.2} />
    </mesh>
  );
}

function ParticleField({ film }: { film: React.MutableRefObject<FilmProgress> }) {
  const positions = useMemo(() => {
    const count = 220;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const p = film.current.p;
    ref.current.rotation.y = state.clock.elapsedTime * 0.04 + p * 0.5;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.08;
    ref.current.position.z = lerp(0, -6, smoothstep(0.4, 0.9, p));
    (ref.current.material as THREE.PointsMaterial).opacity = 0.35 + p * 0.25;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color={GOLD}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Scene({ film }: { film: React.MutableRefObject<FilmProgress> }) {
  return (
    <>
      {/* Transparent clear — distant mountains / name show through from behind */}
      <fog attach="fog" args={[BG, 14, 36]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 4]} intensity={1.9} color={CREAM} />
      <pointLight position={[-4, 3, 5]} intensity={4.5} color={GOLD} />
      <pointLight position={[4, -1, 2]} intensity={2} color={CREAM} />
      <spotLight position={[0, 8, 2]} angle={0.5} penumbra={0.6} intensity={2.2} color={GOLD} />

      <CameraRig film={film} />

      {/* Stacks closer to center — with names */}
      <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.2}>
        <HashStack film={film} position={[-3.1, 0.3, 0.15]} scale={0.92} phase={0} label="Core" />
      </Float>
      <Float speed={1.15} rotationIntensity={0.14} floatIntensity={0.24}>
        <HashStack film={film} position={[3.2, 0.15, 0]} scale={0.84} phase={1.1} label="Platform" />
      </Float>
      <Float speed={0.9} rotationIntensity={0.12} floatIntensity={0.2}>
        <HashStack film={film} position={[-3.7, -0.95, 1.1]} scale={0.58} phase={0.5} label="AI" />
      </Float>
      <Float speed={1.05} rotationIntensity={0.16} floatIntensity={0.22}>
        <HashStack film={film} position={[3.8, -0.85, 0.9]} scale={0.54} phase={1.8} label="Cloud" />
      </Float>
      <Float speed={0.95} rotationIntensity={0.1} floatIntensity={0.18}>
        <HashStack film={film} position={[-2.7, 1.55, -1.5]} scale={0.45} phase={2.2} label="Product" />
      </Float>

      <SdlcRing film={film} />
      <FloatingOrbs film={film} />
      <ParticleField film={film} />
      <Sparkles count={50} scale={[12, 6, 12]} size={1.8} speed={0.25} color={GOLD} opacity={0.45} />

      {/* Soft ground — doesn't block horizon */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.6, 0]}>
        <circleGeometry args={[7, 64]} />
        <meshStandardMaterial
          color="#0e0c0a"
          metalness={0.85}
          roughness={0.45}
          transparent
          opacity={0.55}
        />
      </mesh>
    </>
  );
}

export default function HeroCanvas({
  triggerRef,
}: {
  triggerRef?: React.RefObject<HTMLElement | null>;
}) {
  const film = useRef<FilmProgress>({ p: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const trigger = triggerRef?.current ?? document.querySelector("#cinematic-film");
      if (!trigger) return;

      const st = ScrollTrigger.create({
        trigger,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.65,
        onUpdate: (self) => {
          film.current.p = self.progress;
        },
      });

      return () => st.kill();
    },
    { scope: wrapRef, dependencies: [triggerRef] },
  );

  return (
    <div ref={wrapRef} className="absolute inset-0 z-[3]">
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0.4, 0.7, 8.5], fov: 40, near: 0.1, far: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          premultipliedAlpha: true,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
        }}
        style={{ width: "100%", height: "100%", display: "block", background: "transparent" }}
      >
        <Scene film={film} />
      </Canvas>
      {/* Keep top readable; leave lower horizon open for distant mountains */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(20,18,16,0.35)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#141210]/55 via-transparent to-transparent" />
    </div>
  );
}
