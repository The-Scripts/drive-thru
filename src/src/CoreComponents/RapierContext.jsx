import { createContext, useContext, useState, useEffect } from "react";
import * as RAPIER from "@dimforge/rapier3d-compat";

const RapierContext = createContext(null);

export const RapierEngine = ({ children }) => {
    const [rapier, setRapier] = useState(null);

    useEffect(() => {
        RAPIER.init().then(() => setRapier(RAPIER));
    }, []);

    if (!rapier) return <div>Loading Rapier...</div>;

    return (
        <RapierContext.Provider value = {rapier}>
            {children}
        </RapierContext.Provider>
    );
}

export const useRapier = () => {
    return useContext(RapierContext);
}