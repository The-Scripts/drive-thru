import { useRapier } from "../CoreComponents/RapierContext.jsx";
import { usePhysicsWorld } from "../CoreComponents/PhysicsWorldContext.jsx";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

import { Model } from "./HelperObjects/Model.jsx";

export const PiggyBank = ({ position = [0, 0, 0], radius = [0.6], color = "blue", restitution = 0.8, friction = 0.8}) => {
    const RAPIER = useRapier();
    const world = usePhysicsWorld();

    const modelRef = useRef();
    const meshRef = useRef();
    const rigidBodyRef = useRef();

    useEffect(() => {
        if (!RAPIER || !world) return;

        const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(...position);
        const rigidBody = world.createRigidBody(rigidBodyDesc);
        rigidBodyRef.current = rigidBody;

        const colliderDesc = RAPIER.ColliderDesc.ball(radius);
        colliderDesc.setRestitution(restitution);
        colliderDesc.setFriction(friction);
        const collider = world.createCollider(colliderDesc, rigidBody);
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
        <mesh ref={meshRef} position={position} castShadow>
            <Model type={"product"} name={"pig"} scale={[0.025, 0.025, 0.025]} position={[0.0, -0.5, 0.0]} ref={modelRef}/>
            <sphereGeometry args={radius} />
            <meshStandardMaterial color={color}/>
        </mesh>
    )
}