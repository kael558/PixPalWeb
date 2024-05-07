import { OrbitControls, useFBO } from "@react-three/drei";
import { Canvas, useFrame, extend, createPortal  } from "@react-three/fiber";
import { useMemo, useRef, useEffect, useState, Suspense  } from "react";
import * as THREE from "three";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

import SimulationMaterial from './SimulationMaterialv1';

//https://blog.maximeheckel.com/posts/the-magical-world-of-particles-with-react-three-fiber-and-shaders/


const fragmentShader = `
void main() {
  vec3 color = vec3(0.34, 0.53, 0.96);
  gl_FragColor = vec4(color, 1.0);
}
`;

const vertexShader = `
uniform sampler2D uPositions;
uniform float uTime;

void main() {
  vec3 pos = texture2D(uPositions, position.xy).xyz;

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  gl_PointSize = 2.0;
  // Size attenuation;
  gl_PointSize *= step(1.0 - (1.0/64.0), position.x) + 0.7;
}
`;

extend({ SimulationMaterial: SimulationMaterial });

const FBOParticles = ({ audioWorkletNode }) => {
  const size = 300;

  const points = useRef();
  const simulationMaterialRef = useRef();
  const baseShaderMaterialRef = useRef();

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1);
  const positions = new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]);
  const uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]);

  const renderTarget = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
    type: THREE.FloatType,
  });

  const particlesPosition = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      let i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
    }
    return particles;
  }, [size]);


  const uniforms = useMemo(() => ({
    uPositions: {
      value: null,
    },
  }), [])

  useEffect(() => {
    if (!audioWorkletNode) return;
    if (!baseShaderMaterialRef.current) return;

    // TODO add glow effect - https://gist.github.com/ektogamat/af6cae96681679dde817e1f313278c8b
    //audioWorkletNode.port.onmessage = (e) => {};
  }, [audioWorkletNode]);



  useFrame((state) => {
    const { gl, clock } = state;

    gl.setRenderTarget(renderTarget);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    points.current.material.uniforms.uPositions.value = renderTarget.texture;
    simulationMaterialRef.current.uniforms.uTime.value =  clock.elapsedTime;
  });

  return (
    <>
      {createPortal(
        <mesh>
          <simulationMaterial ref={simulationMaterialRef} args={[size]} />
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={positions.length / 3}
              array={positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-uv"
              count={uvs.length / 2}
              array={uvs}
              itemSize={2}
            />
          </bufferGeometry>
        </mesh>,
        scene
      )}
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={baseShaderMaterialRef}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms}
        />
      </points>  
    </>
  );
};

const Stars = (props) => {
  const ref = useRef();
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 2.5, position: [1.5, 1.5, 2.5]}));

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color='#f272c8'
          size={0.006}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const Scene = ({ audioWorkletNode }) => {
  return (
    <Canvas camera={{ position: [1.5, 1.5, 2.5] }}>
       <ambientLight intensity={0.5} />
       <Suspense fallback={null}>
          <Stars />
        </Suspense>
      <FBOParticles audioWorkletNode={audioWorkletNode} />

      <OrbitControls />
    </Canvas>
  );
};

export default Scene;
