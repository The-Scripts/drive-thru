import { useResourceLoader } from "../../CoreHelpers/ResourceLoader";
import { useMemo } from "react";

export const Model = ({ name, type, ...props }, ref) => {
    const loadedModel = useResourceLoader(name, type);
    if (!loadedModel) {
        console.warn("Couldn't create a model, error: No model found. Model name: ", name, " model type: ", type);
        return <></>
    }

    const clonedModel = useMemo(() => {
        return loadedModel.scene.clone(true);
    }, [loadedModel]);

    return (
        <primitive
            ref={ref}
            object={clonedModel}
            castShadow
            {...props}
        />
    );
}