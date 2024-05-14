import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, Suspense, lazy } from "react";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

const FBOParticles = lazy(() => import("./FBOParticles"));

//https://blog.maximeheckel.com/posts/the-magical-world-of-particles-with-react-three-fiber-and-shaders/
//https://barradeau.com/blog/?p=621

const Stars = (props) => {
	const ref = useRef();
	const [sphere] = useState(
		random.inSphere(new Float32Array(5000), {
			radius: 3,
			position: [1.5, 1.5, 2.5],
		})
	);

	useFrame((state, delta) => {
		ref.current.rotation.x -= delta / 10;
		ref.current.rotation.y -= delta / 15;
	});

	return (
		<group rotation={[0, 0, Math.PI / 4]}>
			<Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
				<PointMaterial
					transparent
					color="#f272c8"
					size={0.006}
					sizeAttenuation={true}
					depthWrite={false}
				/>
			</Points>
		</group>
	);
};



const Scene = ({ streamManager }) => {
	return (
		<>
			<Canvas camera={{ position: [1.5, 1.5, 2.5] }}>
				<Suspense fallback={null}>
					<ambientLight intensity={0.5} />
					<Stars />
					<FBOParticles streamManager={streamManager} />
					<OrbitControls />
				</Suspense>
			</Canvas>
		</>
	);
};

export default Scene;
