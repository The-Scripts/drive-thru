import { useFrame } from '@react-three/fiber';
import { usePhysicsWorld } from './PhysicsWorldContext';

export const PhysicsUpdater = ({ vehicleRef }) => {
    const world = usePhysicsWorld();

    let stepsPassed = 0;
    const fixedTimeStep = 1 / 60;

    useFrame((_, delta) => {
        if (!world) return

        delta = Math.min(delta, 0.05);
        stepsPassed += delta

        while (stepsPassed >= fixedTimeStep) {
            world.step();
            vehicleRef.current.updateVehicle(fixedTimeStep);
            stepsPassed -= fixedTimeStep;
        }
    });

    return null;
}