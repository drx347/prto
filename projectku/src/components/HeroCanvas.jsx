import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Float, RoundedBox, Sparkles, Stars } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function prefersReducedData() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-data: reduce)").matches ?? false;
}

function isLowPowerDevice() {
  const saveData = navigator.connection?.saveData ?? false;
  const deviceMemory = navigator.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  return saveData || deviceMemory <= 4 || cores <= 4;
}

function useCanvasEnabled() {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return true;
    const small = window.matchMedia?.("(max-width: 768px)").matches ?? false;
    return !small && !prefersReducedMotion() && !prefersReducedData() && !isLowPowerDevice();
  });

  useEffect(() => {
    const mqlSmall = window.matchMedia?.("(max-width: 768px)");
    const mqlReduce = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const mqlData = window.matchMedia?.("(prefers-reduced-data: reduce)");
    if (!mqlSmall && !mqlReduce && !mqlData) return;

    const update = () => {
      const small = mqlSmall?.matches ?? false;
      const reduce = mqlReduce?.matches ?? false;
      const reduceData = mqlData?.matches ?? false;
      setEnabled(!small && !reduce && !reduceData && !isLowPowerDevice());
    };

    update();
    mqlSmall?.addEventListener?.("change", update);
    mqlReduce?.addEventListener?.("change", update);
    mqlData?.addEventListener?.("change", update);
    return () => {
      mqlSmall?.removeEventListener?.("change", update);
      mqlReduce?.removeEventListener?.("change", update);
      mqlData?.removeEventListener?.("change", update);
    };
  }, []);

  return enabled;
}

function DemandLoop({ fps = 30 }) {
  const { invalidate } = useThree();

  useEffect(() => {
    let rafId = 0;
    let last = 0;
    const frame = (t) => {
      if (!document.hidden) {
        const interval = 1000 / fps;
        if (t - last >= interval) {
          last = t;
          invalidate();
        }
      }
      rafId = requestAnimationFrame(frame);
    };

    const onVisibility = () => invalidate();
    document.addEventListener("visibilitychange", onVisibility);
    rafId = requestAnimationFrame(frame);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [fps, invalidate]);

  return null;
}

function CameraRig() {
  const target = useRef(new THREE.Vector3());

  useFrame((state) => {
    if (document.hidden) return;
    const { camera, pointer, clock } = state;
    const t = clock.elapsedTime;

    const autoX = Math.sin(t * 0.14) * 0.1;
    const autoY = Math.cos(t * 0.12) * 0.07;

    const x = pointer.x * 0.35 + autoX;
    const y = pointer.y * 0.22 + autoY;
    const z = 1.6 + Math.sin(t * 0.18) * 0.05;

    camera.position.x += (x - camera.position.x) * 0.06;
    camera.position.y += (y - camera.position.y) * 0.06;
    camera.position.z += (z - camera.position.z) * 0.05;

    target.current.set(pointer.x * 0.15 + autoX * 0.5, pointer.y * 0.1 + autoY * 0.5, 0);
    camera.lookAt(target.current);
  });

  return null;
}

function useRadialGradientTexture() {
  return useMemo(() => {
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    grad.addColorStop(0, "rgba(158, 255, 255, 1)");
    grad.addColorStop(0.35, "rgba(133, 180, 255, 0.85)");
    grad.addColorStop(0.65, "rgba(255, 106, 255, 0.7)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
  }, []);
}

function NeonDevice() {
  const group = useRef(null);
  const glowMap = useRadialGradientTexture();
  const reduceMotion = prefersReducedMotion();

  useFrame((state) => {
    if (!group.current) return;
    if (document.hidden) return;
    if (reduceMotion) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.22;
    group.current.rotation.x = Math.sin(t * 0.35) * 0.06;
  });

  return (
    <group ref={group} position={[0, -0.05, 0]}>
      <Float
        speed={reduceMotion ? 0 : 1.15}
        rotationIntensity={reduceMotion ? 0 : 0.35}
        floatIntensity={reduceMotion ? 0 : 0.55}
      >
        <group>
          <mesh position={[0, 0.1, -1.8]} scale={[6.5, 3.4, 1]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              map={glowMap ?? undefined}
              color={glowMap ? "#ffffff" : "#2a1b5a"}
              transparent
              opacity={0.16}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          <group position={[0, -0.25, 0]} rotation={[0.06, -0.35, 0]}>
            <RoundedBox args={[1.55, 0.12, 1.05]} radius={0.08} smoothness={5}>
              <meshPhysicalMaterial
                color="#090f22"
                metalness={0.35}
                roughness={0.35}
                clearcoat={1}
                clearcoatRoughness={0.12}
                sheen={0.2}
                sheenColor="#5ef7ff"
              />
              <Edges scale={1.01} color="#6ff7ff" opacity={0.25} />
            </RoundedBox>

            <RoundedBox
              args={[1.3, 0.03, 0.8]}
              radius={0.04}
              smoothness={4}
              position={[0, 0.075, 0.02]}
            >
              <meshStandardMaterial
                color="#0b1734"
                metalness={0.1}
                roughness={0.7}
                emissive="#153b7a"
                emissiveIntensity={0.2}
              />
            </RoundedBox>

            <group position={[0, 0.08, -0.53]} rotation={[-0.68, 0, 0]}>
              <RoundedBox args={[1.34, 0.86, 0.08]} radius={0.08} smoothness={5}>
                <meshPhysicalMaterial
                  color="#070c1c"
                  metalness={0.25}
                  roughness={0.42}
                  clearcoat={1}
                  clearcoatRoughness={0.2}
                />
                <Edges scale={1.01} color="#ff71ff" opacity={0.2} />
              </RoundedBox>

              <mesh position={[0, 0, 0.055]}>
                <planeGeometry args={[1.14, 0.7]} />
                <meshStandardMaterial
                  color="#070b15"
                  emissive="#9ff8ff"
                  emissiveIntensity={0.85}
                  metalness={0}
                  roughness={0.9}
                />
              </mesh>

              <mesh position={[0, 0, 0.06]} scale={[1.25, 0.95, 1]}>
                <planeGeometry args={[1.14, 0.7]} />
                <meshBasicMaterial
                  map={glowMap ?? undefined}
                  color={glowMap ? "#ffffff" : "#9ff8ff"}
                  transparent
                  opacity={0.22}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
            </group>
          </group>

          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.35, -0.25]}>
            <torusGeometry args={[1.35, 0.015, 10, 220]} />
            <meshBasicMaterial
              color="#7cf6ff"
              transparent
              opacity={0.18}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

function Dust() {
  const points = useRef(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 420;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      positions[i3 + 0] = (Math.random() - 0.5) * 22;
      positions[i3 + 1] = (Math.random() - 0.5) * 12;
      positions[i3 + 2] = (Math.random() - 0.5) * 18;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    if (document.hidden) return;
    const t = state.clock.elapsedTime;
    points.current.rotation.y = t * 0.02;
    points.current.rotation.x = t * 0.01;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.028}
        transparent
        opacity={0.35}
        color="#9ff8ff"
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function Starfield() {
  const group = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!group.current) return;
    if (document.hidden) return;
    group.current.rotation.y = t * 0.014;
    group.current.rotation.x = Math.sin(t * 0.12) * 0.045;
  });

  return (
    <group ref={group}>
      <Stars
        radius={80}
        depth={30}
        count={900}
        factor={2.2}
        saturation={0}
        fade
        speed={0.2}
      />
      <Stars
        radius={160}
        depth={60}
        count={1600}
        factor={2.8}
        saturation={0}
        fade
        speed={0.25}
      />
      <Sparkles
        count={24}
        speed={0.26}
        size={2.0}
        scale={[22, 10, 10]}
        color="#b8f7ff"
        opacity={0.28}
      />
      <Sparkles
        count={18}
        speed={0.18}
        size={1.4}
        scale={[18, 9, 9]}
        color="#ff7dff"
        opacity={0.18}
      />
    </group>
  );
}

export default function HeroCanvas() {
  const enabled = useCanvasEnabled();
  if (!enabled) return null;

  const dpr = useMemo(() => {
    if (typeof window === "undefined") return 1;
    return Math.min(window.devicePixelRatio || 1, 1.5);
  }, []);

  return (
    <div className="hero-canvas">
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 1.6], fov: 60, near: 0.1, far: 500 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        frameloop="demand"
      >
        <DemandLoop fps={30} />
        <color attach="background" args={["#020212"]} />
        <fog attach="fog" args={["#020212", 8, 140]} />
        <CameraRig />
        <ambientLight intensity={0.55} />
        <directionalLight position={[6, 9, 7]} intensity={0.7} color="#c9f8ff" />
        <pointLight position={[8, 10, 6]} intensity={1.15} color="#7cf6ff" />
        <pointLight position={[-9, -5, 8]} intensity={0.85} color="#ff6cff" />
        <spotLight
          position={[0, 6, 4]}
          angle={0.55}
          penumbra={1}
          intensity={0.55}
          color="#b8f7ff"
        />
        <NeonDevice />
        <Dust />
        <Starfield />
      </Canvas>
    </div>
  );
}
