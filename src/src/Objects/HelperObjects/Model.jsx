import { useMemo, forwardRef } from "react";
import { useResourceLoader } from "../../CoreHelpers/ResourceLoader";

export const Model = forwardRef(({ name, type, ...props }, ref) => {
    const loadedModel = useResourceLoader(name, type);
    const scene = loadedModel?.scene;

    const cloned = useMemo(() => {
        if (!scene) return null;
        // Deep clone to avoid reparenting the same Object3D instance across players
        const clone = scene.clone(true);
        return clone;
    }, [scene]);

    if (!cloned) {
        console.warn("Couldn't create a model, error: No model found. Model name:", name, "type:", type);
        return null;
    }

    return (
        <primitive ref={ref} object={cloned} castShadow {...props} />
    );
});