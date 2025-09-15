import { useResourceLoader } from "./ResourceLoader";

export const getCollidersFromModel = (modelName, modelType, RAPIER) => {
    const modelData = useResourceLoader(modelName, modelType);

    let colliders = [];

    modelData.scene.traverse((child) => {
        if (child.isMesh && child.geometry) {
            const geometry = child.geometry.clone();
            geometry.applyMatrix4(child.matrixWorld);
            
            const vertieces = geometry.attributes.position.array;
            const indicies = geometry.index ? geometry.index.array : Array.from({ length: vertieces.length / 3}, (_, i) => i);

            const colliderDesc = RAPIER.ColliderDesc.trimesh(vertieces, indicies);
            colliders.push(colliderDesc);
        }
    });

    return colliders;
}