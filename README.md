Todo:
[x] - Finish voice streaming
[x] - RP script on backend with SSML

Today:
[x] - Chat bar UI
[x] - Buy tokens, hook up buttons
[x] - Tap to record/ tap to end with recording
[x] - Host on pixpal.ca

[x] - Toast system -> displays errors & success messages
[x] - Record audio -> send to backend -> get response 
[x] - CHeck memory -> memory is fixed to local storage
[x] - Randomize orb movement parameters
[x] - Fix re-rendering of orb
[x] - Fix audio bugging, think it is fixed :)
[x] - Basic onboarding sequence with button and name input - "Hey, I'm your personal AI, you can talk to me about anything. You can tap the screen to start recording, and tap again to stop. You can also type messages."
[x] - Add automated open privacy policy/token shop
[x] - User interrupts + streamed response refactor
[x] - Fix UI for mobile
[x] - Anonymous sign in at start
[x] - The orb grows on start-up
[x] - Shorter pauses for conversation
[x] - Onboarding name ask, 2 questions: onboarding, How are you feeling right now? What do you want from this?
[x] - Fix for Iphone and safari.
[x] - Audio visualizer for companion and user
[x] - Base UI
[x] - Hook up UI to values
[x] - NSFW mode with togetherAI API and sentence splitting. 
[x] - Color and particle speed changes with mood & vibe -> https://huggingface.co/mrm8488/t5-base-finetuned-emotion?text=I+wish+you+were+here+but+it+is+impossible
[ ] - Change talking speed & volume based on time.
[ ] - Make orb interactive, moving cursor displaces particles

// horny 

Build
[ ] - Firebase analytics
[ ] - check iPhone 15+, chrome and safari
[ ] - Stress test!
[ ] - Text output on screen

LAUNCH!
Backlogged:
[ ] - Cooler voice recording UI based off Daesol's redesign
[ ] - VAD chatting (not super important, but should be an option)

Optimizations:
[ ] - Sentence split first sentence and group rest. 
[ ] - Whisper Jax to bring down costs of transcription
[ ] - Send input audio in chunks to minimize content upload time


Jeriques Session:
Scroll is not obvious in privacy policy and  release notes.
3s delay for first message as lambda warms up
Microphone use is not obvious (looks like corn)
Clicking on send after recording
She still sounds like a formal robot
Type here placeholder
Responses are too vague. Needs to be specific and listen to user'srequest.
Too politically correct.
Intimate things, like unfiltered sex bot. 'I have a school girl fantasy'.
Narrator mode that describes the scene.
Narrator can also be used as companion. 


Settings:
- AI Settings
-- Gender
-- Role
-- Voice Quality
-- Chat Quality
-- Reset Memory

- Interaction Settings
-- Input: Audio/Text
-- Volume
-- UI Hue
-- Show chat log
-- Visual quality
-- Log out
-- Privacy Policy





Auth flow:
Null user:
- registers account (new account)
- signs in 
Anon user:
- registers account (link to email)
- signs in
- signs out (warning of data loss)
Regular user
 - signs in

Results in:
- First time user is signed in anon


anon user trying to sign in with another email -> error











https://speech.microsoft.com/portal/cacf6cc3a466441fbabfd28d04166472/audiocontentcreation/file?voiceId=db3f068d-39b8-44bc-a809-2e895922741a&languageCode=en-US

<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US"><voice name="en-US-AvaMultilingualNeural" leadingsilence="0ms"><prosody contour="(80%, +0%)(85%, +46%)">When I went to the market yesterday,</prosody><prosody contour="(0%, -20%)"> which was unusually crowded, </prosody> <prosody contour="(0%, +20%)(60%, +0%)"> I couldn't find the apples I was looking for, </prosody><prosody contour="(0%, 50%) (10%, 0%)"> but I did manage to get some fresh oranges. </prosody></voice></speak>

Paper:
https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=39e34a8cb8788494a4927a7c390b766c5acfa459


  /*
  const particlesRef = useRef();
  const numParticles = 1000;
  const positions = useMemo(() => {
    let positions = [];
    for (let i = 0; i < numParticles; i++) {
      const r = 5 + Math.random() * 2; // Radius offset
      const theta = Math.random() * 2 * Math.PI;
      const phi = (Math.random() - 0.5) * Math.PI;
      positions.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
    }
    return new Float32Array(positions);
  }, []);

  useFrame(() => {
    particlesRef.current.rotation.y += 0.005; // Slow rotation of particle system
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute attachObject={['attributes', 'position']} count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <shaderMaterial attach="material" args={[{
        uniforms: {
          pointTexture: { value: new TextureLoader().load('/logo192.png') }
        },
        vertexShader: `
          void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = 2.0; // Size of the points
          }
        `,
        fragmentShader: `
          uniform sampler2D pointTexture;
          void main() {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0) * texture2D(pointTexture, gl_PointCoord);
          }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
      }]} />
    </points>
  );*/


/*const Wave = () => {
  const ref = useRef();
  useFrame(({ clock }) => (ref.current.uTime = clock.getElapsedTime()));

  const [image] = useLoader(THREE.TextureLoader, [
    "https://images.unsplash.com/photo-1604011092346-0b4346ed714e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80"
  ]);

  return (
    <mesh>
      <planeBufferGeometry args={[0.4, 0.6, 16, 16]} />
      <waveShaderMaterial uColor={"hotpink"} ref={ref} uTexture={image} />
    </mesh>
  );
};*/

const WaveShaderMaterial = shaderMaterial(
  // Uniform
  {
    uTime: 0,
    uColor: new THREE.Color(0.0, 0.0, 0.0),
    uTexture: new THREE.Texture()
  },
  // Vertex Shader
  glsl`
    precision mediump float;
 
    varying vec2 vUv;
    varying float vWave;

    uniform float uTime;

    #pragma glslify: snoise3 = require(glsl-noise/simplex/3d.glsl);

    void main() {
      vUv = uv;

      vec3 pos = position;
      float noiseFreq = 2.0;
      float noiseAmp = 0.4;
      vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
      pos.z += snoise3(noisePos) * noiseAmp;
      vWave = pos.z;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);  
    }
  `,
  // Fragment Shader
  glsl`
    precision mediump float;

    uniform vec3 uColor;
    uniform float uTime;
    uniform sampler2D uTexture;

    varying vec2 vUv;
    varying float vWave;

    void main() {
      float wave = vWave * 0.2;
      vec3 texture = texture2D(uTexture, vUv + wave).rgb;
      gl_FragColor = vec4(texture, 1.0); 
    }
  `
);

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
