import { useFrame } from '@react-three/fiber';
import { usePhysicsWorld } from './PhysicsWorldContext';

export const PhysicsUpdater = () => {
    const world = usePhysicsWorld();

    let stepsPassed = 0;
    const fixedTimeStep = 1 / 60;

    useFrame((_, delta) => {
        if (!world) return

        delta = Math.min(delta, 0.05);
        stepsPassed += delta

        while (stepsPassed >= fixedTimeStep) {
            world.step();
            stepsPassed -= fixedTimeStep;
        }
    });

    return null;
}