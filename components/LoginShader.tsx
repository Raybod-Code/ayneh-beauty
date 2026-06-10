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
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p = rot * p * 2.1;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.07;

    vec2 q = vec2(
      fbm(uv + vec2(0.0, 0.0)),
      fbm(uv + vec2(5.2, 1.3))
    );

    vec2 r = vec2(
      fbm(uv + 4.0 * q + vec2(1.7, 9.2) + t * 0.15),
      fbm(uv + 4.0 * q + vec2(8.3, 2.8) + t * 0.126)
    );

    float f = fbm(uv + 4.0 * r);

    vec3 col = mix(
      vec3(0.02, 0.015, 0.01),
      vec3(0.32, 0.22, 0.08),
      clamp(f * f * 4.0, 0.0, 1.0)
    );
    col = mix(col, vec3(0.52, 0.36, 0.12), clamp(length(r) * 0.65, 0.0, 1.0));
    col = mix(col, vec3(0.72, 0.54, 0.24), clamp(f * f * f * 2.2, 0.0, 1.0));

    vec2 vc = uv * 2.0 - 1.0;
    float vig = 1.0 - dot(vc * 0.7, vc * 0.7);
    col *= clamp(vig * 1.15, 0.0, 1.0) * 0.78;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function ShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0.0 } }), []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function LoginShader() {
  return (
    <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ antialias: false, alpha: false }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%" }}
      >
        <ShaderPlane />
      </Canvas>
    </div>
  );
}