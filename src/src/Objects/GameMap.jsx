import { useRapier } from "../CoreComponents/RapierContext.jsx";
import { usePhysicsWorld } from "../CoreComponents/PhysicsWorldContext.jsx";
import { useEffect, useRef } from "react";
import { getCollidersFromModel } from "../CoreHelpers/TrimeshColliderGen.js";
import { Model } from "../Objects/HelperObjects/Model.jsx";

export const GameMap = ({ name, type, ...props }) => {
    const RAPIER = useRapier();
    const world = usePhysicsWorld();

    useEffect(() => {
        if (!RAPIER || !world) return;

        const mapCollidersDesc = getCollidersFromModel(name, type, RAPIER);
        mapCollidersDesc.forEach(collider => world.createCollider(collider, null));
    }, [RAPIER, world]);

    return (
        <mesh>
            <Model name={name} type={type} /> {/*position={[0, -2.45, 0]} scale={[2,2,2]} - Previous map model settings, will add later*/}
        </mesh>
    );
}