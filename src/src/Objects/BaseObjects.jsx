import { useRapier } from "../CoreComponents/RapierContext.jsx";
import { usePhysicsWorld } from "../CoreComponents/PhysicsWorldContext.jsx";
import { useEffect } from "react";

export const Platform = ({ position = [0, 0, 0], size = [10, 1, 10], color = "green" }) => {
    const RAPIER = useRapier();
    const world = usePhysicsWorld();

    useEffect(() => {
        if (!RAPIER || !world) return;

        const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(...position);
        const rigidBody = world.createRigidBody(rigidBodyDesc);

        const colliderDesc = RAPIER.ColliderDesc.cuboid(size[0]/2, size[1]/2, size[2]/2);
        const collider = world.createCollider(colliderDesc, rigidBody);
    }, [RAPIER, world]);

    return (
        <mesh position={position} receiveShadow>
            <boxGeometry args={size} />
            <meshStandardMaterial color={color} />
        </mesh>
    )
}