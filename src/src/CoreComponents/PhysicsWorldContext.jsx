import { createContext, useContext, useState, useEffect } from "react";
import { useFrame } from '@react-three/fiber';
import { useRapier } from "./RapierContext.jsx";

const PhysicsWorldContext = createContext(null);

export const PhysicsWorld = ({ children }) => {
    const RAPIER = useRapier();
    const [world, setWorld] = useState(null);

    useEffect(() => {
        if (!RAPIER || world) return; 

        const gravity = new RAPIER.Vector3(0, -9.81, 0);
        const newWorld = new RAPIER.World(gravity);
        setWorld(newWorld);

    }, [RAPIER, world]);    

    if (!world) return <div>Loading Physics World...</div>;

    return (
        <PhysicsWorldContext.Provider value={world}>
            {children}
        </PhysicsWorldContext.Provider>
    );
}

export const usePhysicsWorld = () => {
    return useContext(PhysicsWorldContext);
}
