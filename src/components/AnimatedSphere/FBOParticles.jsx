import { useFBO } from "@react-three/drei";
import { useFrame, extend, createPortal } from "@react-three/fiber";
import {
	useMemo,
	useRef,
	useEffect} from "react";
import * as THREE from "three";

import SimulationMaterial from "./SimulationMaterialv1";

const fragmentShader = `
void main() {
  vec3 color = vec3(0.34, 0.53, 0.96);
  gl_FragColor = vec4(color, 1.0);
}
`;

const vertexShader = `
uniform sampler2D uPositions;
uniform float uTime;
uniform float uTargetScale;

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

const FBOParticles = ({ streamManager }) => {
	const size = 256;

	const points = useRef();
	const simulationMaterialRef = useRef();
	const baseShaderMaterialRef = useRef();

	const scene = new THREE.Scene();
	const camera = new THREE.OrthographicCamera(
		-1,
		1,
		1,
		-1,
		1 / Math.pow(2, 53),
		1
	);
	const positions = new Float32Array([
		-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
	]);
	const uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]);

	const renderTarget = useFBO(size, size, {
		minFilter: THREE.NearestFilter,
		magFilter: THREE.NearestFilter,
		format: THREE.RGBAFormat,
		stencilBuffer: false,
		type: THREE.FloatType,
	});

	const particlesPosition = useMemo(() => {
		const val = 300;
		const length = size * size;
		const particles = new Float32Array(length * 3);
		for (let i = 0; i < length; i++) {
			let i3 = i * 3;
			particles[i3 + 0] = (i % val) / val;
			particles[i3 + 1] = i / val / val;
		}

		//console.log(particles);
		return particles;
	}, [size]);

	const uniforms = useMemo(
		() => ({
			uPositions: {
				value: null,
			},
		}),
		[]
	);

	useEffect(() => {
		if (!streamManager.audioWorkletNode) return;
		if (!baseShaderMaterialRef.current) return;

		//streamManager.audioWorkletNode.port.onmessage = (e) => {};

		// TODO add glow effect - https://gist.github.com/ektogamat/af6cae96681679dde817e1f313278c8b
		//audioWorkletNode.port.onmessage = (e) => {};
	}, [streamManager.audioWorkletNode]);

	useFrame((state) => {
		const { gl, clock } = state;

		gl.setRenderTarget(renderTarget);
		gl.clear();
		gl.render(scene, camera);
		gl.setRenderTarget(null);

		points.current.material.uniforms.uPositions.value = renderTarget.texture;
		simulationMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
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

/*
const DelayedFBOParticles = ({ audioWorkletNode }) => {
	const [loading, setLoading] = useState(true);
	
	useEffect(() => {
	  const timer = setTimeout(() => setLoading(false), 3000); // 3 seconds delay
	  return () => clearTimeout(timer);
	}, []);
  
	if (loading) {
	  return null;
	}
  
	return <FBOParticles audioWorkletNode={audioWorkletNode} />;
};*/

export default FBOParticles;