import { useFrame } from '@react-three/fiber';
import { useRapier } from './RapierContext';
import { usePhysicsWorld } from './PhysicsWorldContext';

export const PhysicsUpdater = ({ vehicleRef }) => {
    const RAPIER = useRapier();
    const world = usePhysicsWorld();
    const eventQueue = new RAPIER.EventQueue(true);

    let stepsPassed = 0;
    const fixedTimeStep = 1 / 120;
    let timeStep = fixedTimeStep;

    useFrame((_, delta) => {
        if (!world || !RAPIER) return

        delta = Math.min(delta, 0.05);
        stepsPassed += delta

        while (stepsPassed >= timeStep * delta) {
            world.step(eventQueue);
            vehicleRef.current.updateVehicle(fixedTimeStep);
            stepsPassed -= fixedTimeStep;
        }

    eventQueue.drainCollisionEvents((handle1, handle2, started) => {
        const collider1 = world.getCollider(handle1);
        const collider2 = world.getCollider(handle2);

        const colliderType1 = collider1.userData?.type;
        const colliderType2 = collider2.userData?.type;


        if (colliderType1 == "vehicle" || colliderType2 == "vehicle") {
            console.log("Car bumped. ")
        }

        if (colliderType1 == "product" && collider2 == "spawner-sensor" || colliderType1 == "spawner-sensor" && colliderType2 == "product") {
            if (started) {
                console.log("Something entered");
            } else {
                if (colliderType1 == "product") {
                    collider1.parent().spawnObject();
                } else if (colliderType2 == "product") {
                    collider2.parent().spawnObject();
                }
                
            }
        }
    })

    });

    return null;
}