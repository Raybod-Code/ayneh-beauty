"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Gold color palette
  vec3 gold1 = vec3(0.776, 0.659, 0.486);  // #C6A87C
  vec3 gold2 = vec3(0.502, 0.384, 0.224);  // deep gold
  vec3 dark  = vec3(0.039, 0.039, 0.039);  // #0a0a0a

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amp = 0.5;
    float freq = 2.0;
    for (int i = 0; i < 5; i++) {
      value += amp * smoothNoise(p * freq);
      amp *= 0.5;
      freq *= 2.0;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.12;

    // دو لایه حرکت متفاوت
    vec2 p1 = uv + vec2(t * 0.3, t * 0.2);
    vec2 p2 = uv + vec2(-t * 0.2, t * 0.35);

    float n1 = fbm(p1 * 2.5);
    float n2 = fbm(p2 * 2.5 + n1);
    float n3 = fbm(uv * 1.5 + n2 + t * 0.1);

    // ترکیب noise لایه‌ها
    float pattern = n3 * 0.6 + n1 * 0.4;

    // رنگ‌آمیزی
    vec3 color = mix(dark, gold2 * 0.3, pattern * 0.8);
    color = mix(color, gold1 * 0.15, smoothstep(0.4, 0.8, pattern));

    // vignette
    vec2 vig = uv * 2.0 - 1.0;
    float vignette = 1.0 - dot(vig * 0.6, vig * 0.6);
    color *= clamp(vignette, 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function ShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(
          typeof window !== "undefined" ? window.innerWidth : 1920,
          typeof window !== "undefined" ? window.innerHeight : 1080
        ),
      },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value =
        clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} scale={[2, 2, 1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function ShaderBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ antialias: false, alpha: false }}
        dpr={[1, 1.5]}
      >
        <ShaderPlane />
      </Canvas>
    </div>
  );
}