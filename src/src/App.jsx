import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { PhysicsWorld } from './CoreComponents/PhysicsWorldContext.jsx'

import { Platform } from './Objects/BaseObjects.jsx'

export const Enviroment = () => {
  return (
    <PhysicsWorld>
      <Canvas camera={{ position: [5, 5, 5], fov: 70}}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} />
        
        <group>
          <Platform position={[0, -5, 0]} size={[50, 5, 50]} />
        </group>

        <OrbitControls />
      </Canvas>
    </PhysicsWorld>
  )
}
