import { useRapier } from "../../CoreComponents/RapierContext";
import { usePhysicsWorld } from "../../CoreComponents/PhysicsWorldContext";
import { useEffect, useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { SpawnersConfig } from "../../EnviromentPresets/SpawnersConfig";
import { Product } from "./Product";
import * as THREE from 'three';

export const ProductSpawner = ({ spawnerConfig = SpawnersConfig[0] }) => {
    const [spawnedProducts, setSpawnedProducts] = useState([]);
    const [apiProducts, setApiProducts] = useState(null);
    const sensorOffset = new THREE.Vector3(spawnerConfig.position[0], spawnerConfig.position[1], spawnerConfig.position[2]);
    const sensorPosition = new THREE.Vector3(0, -1.5, 0);

    const spawnObject = () => {
        console.log("[INFO] attempting to spawn piggyBank");
        setSpawnedProducts([...spawnedProducts, spawnerConfig]);
    }

    const RAPIER = useRapier();
    const world = usePhysicsWorld();
    const sensorRef = useRef();

    useEffect(() => {
        if (!RAPIER || !world) return;

            let sensorBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(...spawnerConfig.position);
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

    useEffect(() => {
        const controller = new AbortController();
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products", {
                    method: "GET",
                    headers: { "Accept": "application/json" },
                    signal: controller.signal,
                });
                if (!res.ok) {
                    console.error("[ERROR] Fetch /api/products failed:", res.status, res.statusText);
                    return;
                }
                const data = await res.json();
                console.log("[INFO] /api/products response:", data);
                setApiProducts(data);
            } catch (err) {
                if (err.name === "AbortError") return;
                console.error("[ERROR] Fetch /api/products exception:", err);
            }
        };
        fetchProducts();
        return () => controller.abort();
    }, []);

    return (
        <>
            <group name="Spawned Objects">
                {spawnedProducts.map((config) => (
                    <Product key={config.id} config={config.defaultProduct} position={config.position} />
                ))}
            </group>
            
            {apiProducts && (
                <primitive object={new THREE.AxesHelper(0)} />
            )}
            {/*<mesh position={sensorOffset}>
                <boxGeometry args={[1.5, 1.5, 1.5]} />
                <meshStandardMaterial color={"blue"} />
            </mesh>*/}
            <mesh position={spawnerConfig.position}>
                <sphereGeometry args={[0.6]} />
                <meshStandardMaterial color={"red"} />
            </mesh>
        </>
    )
}