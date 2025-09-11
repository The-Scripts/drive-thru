import { useGLTF } from "@react-three/drei";
import { cars, maps } from '../EnviromentPresets/ModelsList';

export function initResourceLoader() {
    _preloadResources();
}

export function useResourceLoader(name, type) {
    const resourcePath = _getPathFromName(name, type);
    if (!resourcePath) console.warn("Wrong resource path for name: ", name, " type: ", type);

    const { scene, nodes, materials } = useGLTF(resourcePath);
    return { scene, nodes, materials }; 
}

function _getPathFromName(name, type) {
    if (type == "car") {
        return cars[name].hull;
    }
    else if (type == "wheel") {
        return cars[name].wheel;
    }
    else if (type == "map") {
        return maps[name];
    }
}

function _preloadResources() {
    Object.entries(cars).forEach(([_, path]) => {
        //console.log("hullPath: ", path.hull, " wheelPath: ", path.wheel);
        useGLTF.preload(path.hull);
        useGLTF.preload(path.wheel);
    });

    Object.entries(maps).forEach(([_, path]) => {
        //console.log("Map: ", path);
        useGLTF.preload(path);
    });
}