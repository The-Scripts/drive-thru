import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { PhysicsWorld } from './CoreComponents/PhysicsWorldContext.jsx'
import { PhysicsUpdater } from './CoreComponents/PhysicsUpdater.jsx'

import { Platform, Ball } from './Objects/BaseObjects.jsx'
import { Vehicle } from './Objects/Vehicle.jsx'

export const Enviroment = () => {
  return (
    <PhysicsWorld>
      <Canvas shadows camera={{ position: [5, 5, 5], fov: 70}}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} castShadow/>
        
        <group>
          <Ball position={[0, 10, 0]} size={[2]} restitution={2}/>
          <Platform position={[0, -5, 0]} size={[50, 5, 50]} />
        </group>

        <OrbitControls />
        <PhysicsUpdater /> {/* Don't touch */}
      </Canvas>
    </PhysicsWorld>
  )
}
