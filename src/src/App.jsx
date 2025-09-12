import { Canvas } from '@react-three/fiber'
import { OrbitControls, KeyboardControls } from '@react-three/drei'
import { PhysicsWorld } from './CoreComponents/PhysicsWorldContext.jsx'
import { PhysicsUpdater } from './CoreComponents/PhysicsUpdater.jsx'
import { initResourceLoader } from './CoreHelpers/ResourceLoader.js'

import { Platform, Ball } from './Objects/BaseObjects.jsx'
import { Vehicle } from './Objects/Vehicle.jsx'
import { Model } from './Objects/HelperObjects/Model.jsx'

const controlsMap = [
  { name: "forward", keys: ['ArrowUp', 'KeyW'] },
  { name: "back", keys: ['ArrowDown', 'KeyS'] },
  { name: "left", keys: ['ArrowLeft', 'KeyA'] },
  { name: "right", keys: ['ArrowRight', 'KeyD'] },
];

export const Enviroment = () => {
  initResourceLoader();

  return (
    <KeyboardControls map={controlsMap}>
      <PhysicsWorld>
        <Canvas shadows camera={{ position: [5, 5, 5], fov: 70}}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 30, 5]} castShadow/>
          
          <group>
            <Vehicle />
            <Ball position={[10, 1, 10]} radius={[0.5]} color='white' restitution={0.5}/>
            <Ball position={[10, 1, 11.5]} radius={[0.5]} color='white' restitution={0.5}/>
            <Ball position={[10, 1, 13]} radius={[0.5]} color='white' restitution={0.5}/>
            <Ball position={[11.5, 1, 11.5]} radius={[0.5]} color='white' restitution={0.5}/>
            <Platform position={[0, -5, 0]} size={[1500, 5, 1500]} />
            <Model name={"supermarket02"} type={"map"} position={[0, -2.45, 0]} scale={[2,2,2]}/>
          </group>

          <OrbitControls />
          <PhysicsUpdater /> {/* Don't touch */}
        </Canvas>
      </PhysicsWorld>
    </KeyboardControls>
  )
}
