import { useRapier } from "../../CoreComponents/RapierContext";
import { usePhysicsWorld } from "../../CoreComponents/PhysicsWorldContext";
import { useEffect, useState } from "react";

import { ProductsConfigs } from "../../EnviromentPresets/ProductsConfig";
import { Product } from "./Product";

const productCongif = ProductsConfigs[0] // Placeholder

export const ProductSpawner = ({ position = [0, 2, 0] }) => {
    const [spawnedProducts, setSpawnedProducts] = useState([]);

    const spawnObject = () => {
        console.log("[INFO] attempting to spawn piggyBank");
        setSpawnedProducts([...spawnedProducts, productCongif]);
    }

    const RAPIER = useRapier();
    const world = usePhysicsWorld();

    useEffect(() => {
        if (!RAPIER || !world) return;
        spawnObject();
    }, [RAPIER, world]);

    return (
        <>
            <group name="Spawned Objects">
                {spawnedProducts.map((config) => (
                    <Product key={config.id} config={config} position={position}/>
                ))}
            </group>
            <mesh position={position}>
                <sphereGeometry args={[0.6]}/>
                <meshStandardMaterial color={"red"} />
            </mesh>
        </>
    )
}