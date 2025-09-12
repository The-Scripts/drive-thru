import { useResourceLoader } from "../../CoreHelpers/ResourceLoader";

export const Model = ({ name, type, ...props }, ref) => {
    const loadedModel = useResourceLoader(name, type);
    if (!loadedModel) {
        console.warn("Couldn't create a model, error: No model found. Model name: ", name, " model type: ", type);
        return <></>
    }

    return (
        <primitive
            ref={ref}
            object={loadedModel.scene}
            castShadow
            {...props}
        />
    );
}