import { useFBO } from "@react-three/drei";
import { useFrame, extend, createPortal } from "@react-three/fiber";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import SimulationMaterial from "./SimulationMaterialv1";

const fragmentShader = `
uniform vec3 uCurrentColor;
uniform vec3 uTargetColor;
uniform float uTransitionFactor;

void main() {
    vec3 color = mix(uCurrentColor, uTargetColor, uTransitionFactor);
  	gl_FragColor = vec4(color, 1.0);
}
`;

const vertexShader = `
uniform sampler2D uPositions;
uniform float uTime;
uniform float uTargetGrowthScale;

void main() {
  vec3 pos = texture2D(uPositions, position.xy).xyz;
  pos.y += 0.7;

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

const FBOParticles = ({ streamManager}) => {
	const size =  256;


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
		const val = 256;
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
			uCurrentColor: { value: new THREE.Color(0.34, 0.53, 0.96) },
			uTargetColor: { value: new THREE.Color(0.34, 0.53, 0.96) },
			uTransitionFactor: { value: 0.0 },
		}),
		[]
	);

	useEffect(() => {
		if (!streamManager) return;
		if (!baseShaderMaterialRef.current) return;
		let timer;

		streamManager.onmessage = (e) => {
			if (e.name === "change_color") {
				if (timer) clearInterval(timer);

				baseShaderMaterialRef.current.uniforms.uCurrentColor.value.copy(baseShaderMaterialRef.current.uniforms.uTargetColor.value);
				baseShaderMaterialRef.current.uniforms.uTargetColor.value.set(e.data.color);
				baseShaderMaterialRef.current.uniforms.uTransitionFactor.value = 0.0;

				timer = setInterval(() => {
					const color = new THREE.Color(
						Math.random(),
						Math.random(),
						Math.random()
					);
		
					//console.log("Changing color to", color);
					baseShaderMaterialRef.current.uniforms.uCurrentColor.value.copy(
						baseShaderMaterialRef.current.uniforms.uTargetColor.value
					);	
					baseShaderMaterialRef.current.uniforms.uTargetColor.value.set(color);
					baseShaderMaterialRef.current.uniforms.uTransitionFactor.value = 0.0;
				}, Math.random() * 10000 + 15000);
			}
		};

		return () => {
			streamManager.onmessage = null;
			clearInterval(timer);
		};

		/*streamManager.audioWorkletNode.port.onmessage = (e) => {
			simulationMaterialRef.current.uniforms.uAdditionalGrowthScale.value = 1.0 + e.data.averageLevel/10;
		};*/

		// TODO add glow effect - https://gist.github.com/ektogamat/af6cae96681679dde817e1f313278c8b
		//audioWorkletNode.port.onmessage = (e) => {};
	}, [streamManager]);

	
	useFrame((state) => {
		const { gl, clock } = state;

		gl.setRenderTarget(renderTarget);
		gl.clear();
		gl.render(scene, camera);
		gl.setRenderTarget(null);

		points.current.material.uniforms.uPositions.value = renderTarget.texture;
		simulationMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;

		const growthScale = Math.min(1.0, clock.elapsedTime / 10);
		simulationMaterialRef.current.uniforms.uTargetGrowthScale.value =
			growthScale;

		baseShaderMaterialRef.current.uniforms.uTransitionFactor.value = Math.min(1, baseShaderMaterialRef.current.uniforms.uTransitionFactor.value + 0.001);

	
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
					emissive="#f272c8"
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
