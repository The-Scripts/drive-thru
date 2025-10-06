import { useRapier } from "../CoreComponents/RapierContext.jsx";
import { usePhysicsWorld } from "../CoreComponents/PhysicsWorldContext.jsx";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

export const Platform = ({
    position = [0, 0, 0],
    size = [10, 1, 10],
    color = "green",
}) => {
    const RAPIER = useRapier();
    const world = usePhysicsWorld();

    useEffect(() => {
        if (!RAPIER || !world) return;

        const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
            ...position
        );
        const rigidBody = world.createRigidBody(rigidBodyDesc);

        const colliderDesc = RAPIER.ColliderDesc.cuboid(
            size[0] / 2,
            size[1] / 2,
            size[2] / 2
        );
        const collider = world.createCollider(colliderDesc, rigidBody);
    }, [RAPIER, world]);

    return (
        <mesh position={position} receiveShadow>
            <boxGeometry args={size} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
};

export const Ball = ({
    position = [0, 0, 0],
    radius = 0.5,
    color = "blue",
    restitution = 0.8,
    getAutoPosition,
}) => {
    const RAPIER = useRapier();
    const world = usePhysicsWorld();

    const meshRef = useRef();
    const rigidBodyRef = useRef();
    const [currentColor, setCurrentColor] = useState(color);
    const [inCart, setInCart] = useState(false);

    useEffect(() => {
        if (!RAPIER || !world) return;

        const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(
            ...position
        );
        const rigidBody = world.createRigidBody(rigidBodyDesc);
        rigidBodyRef.current = rigidBody;

        const colliderDesc = RAPIER.ColliderDesc.ball(radius);
        colliderDesc.setRestitution(restitution);
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

    const handleClick = () => {
        setCurrentColor("green");
        setInCart(true);

        if (rigidBodyRef.current && getAutoPosition) {
            const [x, y, z] = getAutoPosition();
            rigidBodyRef.current.setTranslation({ x, y, z }, true);
            if (meshRef.current) {
                meshRef.current.position.set(x, y, z);
            }
        }
    };

    return (
        <mesh
            ref={meshRef}
            position={position}
            castShadow
            onClick={handleClick}
        >
            <sphereGeometry args={[radius]} />
            <meshStandardMaterial color={currentColor} />
        </mesh>
    );
};
