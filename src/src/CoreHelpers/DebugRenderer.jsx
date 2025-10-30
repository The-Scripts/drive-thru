import { usePhysicsWorld } from "../CoreComponents/PhysicsWorldContext";
import { useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";

export const DebugRenderer = ( { disabled = false }) => {
    const world = usePhysicsWorld();
    const [lines, setLines] = useState([]);

    if (disabled) return null;
    

    useFrame(() => {
        const { vertices, _colors } = world.debugRender();

        const newLines = [];

        for (let i = 0; i < vertices.length; i += 6) {
            const p1 = [vertices[i], vertices[i + 1], vertices[i + 2]];
            const p2 = [vertices[i + 3], vertices[i + 4], vertices[i + 5]];

            newLines.push({ points: [p1, p2] });
        }

        setLines(newLines);
    });

    return (
        <>
            {lines.map((line, index) => (
                <Line 
                    key={index}
                    points={line.points}
                    lineWidth={1}
                />
            ))}
        </>
    );
}