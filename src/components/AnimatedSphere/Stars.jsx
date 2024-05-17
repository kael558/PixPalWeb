import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as random from 'maath/random';
import { Points, PointMaterial } from "@react-three/drei";

// Custom shader material
/*
class FadePointMaterial extends ShaderMaterial {
  constructor() {
    super({
      transparent: true,
      vertexShader: `
        attribute float size;
        varying float vAlpha;
        uniform float cameraDistanceFade;

        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;

          float distance = length(mvPosition.xyz);
          vAlpha = 1.0 - smoothstep(cameraDistanceFade - 1.0, cameraDistanceFade, distance);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vAlpha;

        void main() {
          gl_FragColor = vec4(color, vAlpha);
        }
      `,
      uniforms: {
        color: { value: new Vector3(1, 1, 1) },
        cameraDistanceFade: { value: 20.0 } // Adjust based on desired fading start distance
      }
    });
  }
}

// Register the material in react-three-fiber
extend({ FadePointMaterial });*/
const Stars = (props) => {
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
};

/*
const Stars = (props) => {
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

  const sizes = useMemo(() => new Float32Array(sphere.length / 3).fill(0.006), [sphere]);

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <fadePointMaterial
          attach="material"
          args={[{ color: new Vector3(1, 1, 1), cameraDistanceFade: 2.0 }]}
        />
      </Points>
    </group>
  );
};*/

export default Stars;
