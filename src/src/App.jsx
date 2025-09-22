import { Canvas } from '@react-three/fiber';
import { OrbitControls, KeyboardControls, Stats, Sky } from '@react-three/drei';
import { useRef } from 'react'
import { PhysicsWorld } from './CoreComponents/PhysicsWorldContext.jsx';
import { PhysicsUpdater } from './CoreComponents/PhysicsUpdater.jsx';
import { DebugRenderer} from './CoreHelpers/DebugRenderer.jsx';
import { initResourceLoader } from './CoreHelpers/ResourceLoader.js';

import { GameMap } from './Objects/GameMap.jsx';
import { Ball } from './Objects/BaseObjects.jsx';
import { Vehicle } from './Objects/Vehicle.jsx';

const controlsMap = [
  { name: "forward", keys: ['ArrowUp', 'KeyW'] },
  { name: "back", keys: ['ArrowDown', 'KeyS'] },
  { name: "left", keys: ['ArrowLeft', 'KeyA'] },
  { name: "right", keys: ['ArrowRight', 'KeyD'] },
  { name: "brake", keys: ['Space'] },
  { name: "flip", keys: ['KeyR'] } ,
];

import { ChatOverlay } from './ui/ChatOverlay.jsx';

export const Enviroment = () => {
  initResourceLoader();

  const vehicleRef = useRef();

  return (
    <KeyboardControls map={controlsMap}>
      <PhysicsWorld>
        <Canvas
          shadows
          camera={{ position: [5, 5, 5], fov: 70}}
        >
          <Sky sunPosition={[100, 10, 100]} distance={1000} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 30, 5]} castShadow/>
          
          <group>
            <Vehicle ref={vehicleRef} />
            <Ball position={[10, 1, 10]} radius={[0.5]} color='white' restitution={0.5}/>
            <Ball position={[10, 1, 11.5]} radius={[0.5]} color='white' restitution={0.5}/>
            <Ball position={[10, 1, 13]} radius={[0.5]} color='white' restitution={0.5}/>
            <Ball position={[11.5, 1, 11.5]} radius={[0.5]} color='white' restitution={0.5}/>
            <Ball position={[3, 4, 3]} radius={[0.5]} color='white' restitution={2}/>
            <GameMap name={"supermarket02"} type={"map"} />
          </group>

          <OrbitControls />
          <DebugRenderer disabled/> { /* remove flag to use, caution: it lags a ton.(will fix later) */ }
          < Stats />
          <PhysicsUpdater vehicleRef={vehicleRef}/> {/* Don't touch */}
        </Canvas>
        <ChatOverlay />
        </PhysicsWorld>
    </KeyboardControls>
  )
}
