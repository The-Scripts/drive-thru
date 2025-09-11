import { useFrame } from '@react-three/fiber';
import { usePhysicsWorld } from './PhysicsWorldContext';

export const PhysicsUpdater = () => {
    const world = usePhysicsWorld();

    useFrame(() => {
        if (world) {
            world.step();
        }
    });

    return null;
}