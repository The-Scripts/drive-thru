import { useRapier } from "../../CoreComponents/RapierContext";
import { usePhysicsWorld } from "../../CoreComponents/PhysicsWorldContext";
import { useEffect } from "react";
import React from "react";

import { PiggyBank } from "../ProductObjects";

function spawnObject() {
    console.log("[INFO] attempting to spawn piggyBank")
    console.log(React.createElement(PiggyBank));
}

export const ProductSpawner = () => {
    const RAPIER = useRapier();
    const world = usePhysicsWorld();

    useEffect(() => {
        if (!RAPIER || !world) return;
        spawnObject();
    }, [RAPIER, world]);


    return (
        <>
            <boxGeometry />
            <meshStandardMaterial color={"red"} />
        </>
    )
}