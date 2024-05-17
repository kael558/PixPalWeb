import { Canvas, useThree } from "@react-three/fiber";
import { useRef, useState, Suspense, lazy } from "react";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import Stars from "./Stars";

const FBOParticles = lazy(() => import("./FBOParticles"));

const LAYERS = {
	NORMAL: 0,
	BLOOM: 1,
  };
//https://blog.maximeheckel.com/posts/the-magical-world-of-particles-with-react-three-fiber-and-shaders/
//https://barradeau.com/blog/?p=621

/*const Stars = (props) => {
	const ref = useRef();
	const [sphere] = useState(
		random.inSphere(new Float32Array(5000), {
			radius: 3,
			position: [1.5, 1.5, 2.5],
		})
	);

	useFrame((state, delta) => {
		ref.current.rotation.x -= delta * 0.1;
		ref.current.rotation.y -= delta * 0.06;
	});

	return (
		<group rotation={[0, 0, Math.PI / 4]}>
			<Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
				<PointMaterial
					transparent
					size={0.006}
					sizeAttenuation={true}
					depthWrite={false}
				/>
			</Points>
		</group>
	);
};*/

const BloomEffect = ({ streamManager }) => {
	/*useEffect(() => {
		if (!streamManager.audioWorkletNode) return;
		streamManager.audioWorkletNode.port.onmessage = (e) => {
			const targetIntensity = e.data.isTalking ? 1.0 : 0.2;

			if (e.data.isTalking){
				console.log("isTalking");
			} else {
				console.log("isNotTalking");
			}

			const diff = targetIntensity - bloomIntensity;
			const step = diff;
			setBloomIntensity(bloomIntensity + step);

			//setBloomIntensity(e.data.averageLevel);
			//console.log("onmessage", e.data);
		};
	}, [streamManager.audioWorkletNode]);*/



	return (
		<EffectComposer>
			<Bloom
				intensity={0.4}
				layers={[LAYERS.BLOOM]}
				luminanceThreshold={0.2}
				luminanceSmoothing={0.2}
				height={1000}
				opacity={2}
			></Bloom>
			<Noise opacity={0.1} />
			<Vignette eskil={false} offset={0.1} darkness={1.1} />
		</EffectComposer>
	);
};

const Scene = ({ streamManager }) => {
	return (
		<>
			<Canvas camera={{ position: [1.5, 1.5, 1.5] }}>
				<Suspense fallback={null}>
					<BloomEffect streamManager={streamManager} />
					
		
						<Stars />
	
						<FBOParticles streamManager={streamManager} />
			
	
				</Suspense>
			</Canvas>
		</>
	);
};

export default Scene;
