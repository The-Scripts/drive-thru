import { Canvas } from '@react-three/fiber'
import { Physics, RigidBody } from '@react-three/rapier'
import { Gltf, Environment, Fisheye, KeyboardControls, Stats } from '@react-three/drei'
import Controller from 'ecctrl'

function App() {
  const keyboardMap = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
    { name: 'run', keys: ['Shift'] },
  ]

  return (
    <Canvas shadows onPointerDown={(e) => e.target.requestPointerLock()}>
      <Stats/>
      <Fisheye zoom={0.4}>
        <Environment files="/night.hdr" ground={{ scale: 100 }} />
        <directionalLight intensity={0.7} castShadow shadow-bias={-0.0004} position={[-20, 20, 20]}>
          <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20]} />
        </directionalLight>
        <ambientLight intensity={0.2} />
        <Physics timeStep="vary">
          <KeyboardControls map={keyboardMap}>
            <Controller maxVelLimit={5}>
              <Gltf castShadow receiveShadow scale={0.115} position={[0, -0.9, 0]} src="/car.glb" />
            </Controller>
          </KeyboardControls>
          <RigidBody type="fixed" colliders="trimesh">
            <Gltf castShadow receiveShadow scale={0.11} src="/racek.glb" />
          </RigidBody>
        </Physics>
      </Fisheye>
    </Canvas>
  )
}

export default App
