import { useRapier } from "../../CoreComponents/RapierContext";
import { usePhysicsWorld } from "../../CoreComponents/PhysicsWorldContext";
import { useEffect, useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ProductsConfigs } from "../../EnviromentPresets/ProductsConfig";
import { Product } from "./Product";
import * as THREE from 'three';


const productCongif = ProductsConfigs[0] // Placeholder

export const ProductSpawner = ({ position = [0, 2, 0] }) => {
    const [spawnedProducts, setSpawnedProducts] = useState([]);

    const sensorOffset = new THREE.Vector3(position[0], position[1], position[2]);
    const sensorPosition = new THREE.Vector3(0, -1.5, 0);

    const spawnObject = () => {
        console.log("[INFO] attempting to spawn piggyBank");
        setSpawnedProducts([...spawnedProducts, productCongif]);
    }

    const RAPIER = useRapier();
    const world = usePhysicsWorld();
    const sensorRef = useRef();

    useEffect(() => {
        if (!RAPIER || !world) return;

            let sensorBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(...position);
            let sensorBody = world.createRigidBody(sensorBodyDesc);

            let sensorColliderDesc = RAPIER.ColliderDesc.cuboid(0.75, 0.75, 0.75).setSensor(true)
                .setTranslation(...sensorPosition)
                .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
            sensorColliderDesc.position = sensorOffset;

            const sensorCollider = world.createCollider(sensorColliderDesc, sensorBody);
            sensorCollider.userData = { type: "spawner-sensor"}
            sensorRef.current = sensorCollider
            spawnObject();
    }, [RAPIER, world]);

    return (
        <>
            <group name="Spawned Objects">
                {spawnedProducts.map((config) => (
                    <Product key={config.id} config={config} position={position}/>
                ))}
            </group>
            {/*<mesh position={sensorOffset}>
                <boxGeometry args={[1.5, 1.5, 1.5]} />
                <meshStandardMaterial color={"blue"} />
            </mesh>*/}
            <mesh position={position}>
                <sphereGeometry args={[0.6]} />
                <meshStandardMaterial color={"red"} />
            </mesh>
        </>
    )
}