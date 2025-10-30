import { useRapier } from "../../CoreComponents/RapierContext";
import { usePhysicsWorld } from "../../CoreComponents/PhysicsWorldContext";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Model } from "./Model";
import { COLLISION_GROUP } from "../../EnviromentPresets/CollisionLayersConfig";

export const Product = ({ config = {}, position = [0, 0, 0] }) => {
    const RAPIER = useRapier();
    const world = usePhysicsWorld();

    const meshRef = useRef();
    const rigidBodyRef = useRef();

    useEffect(() => {
        if (!RAPIER || !world) return;

        if (config == {}) {
            console.warn("[WARNING] Created a product without a config!!!");
            return;
        }

        const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(...position);
        const rigidBody = world.createRigidBody(rigidBodyDesc);
        rigidBodyRef.current = rigidBody;

        // TODO --> Add collider config
        const colliderDesc = RAPIER.ColliderDesc.ball(config.colliderConfig.radius)
            .setCollisionGroups(
                (COLLISION_GROUP.SENSOR << 16) |
                (COLLISION_GROUP.CHASSIS)
            );
        const collider = world.createCollider(colliderDesc, rigidBody);
        collider.userData = { type: "product"};
    }, [RAPIER, world]);

    useFrame(() => {
        const mesh = meshRef.current;
        const body = rigidBodyRef.current;

        if (mesh && body) {
            const translation = body.translation();
            const rotation = body.rotation();

            mesh.position.set(translation.x, translation.y, translation.z);
            mesh.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
        }
    });

    return (
        <mesh ref={meshRef} position={position}>
            <Model name={config.modelConfig.name} scale={config.modelConfig.scale} type={"product"} position={config.modelConfig.offset} />
            <sphereGeometry args={[0.6]}/>
            <meshStandardMaterial color={"pink"} />
        </mesh>
    );
}