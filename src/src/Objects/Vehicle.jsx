import { useRapier } from "../CoreComponents/RapierContext";
import { usePhysicsWorld } from "../CoreComponents/PhysicsWorldContext";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

import { defaultSettings } from "../EnviromentPresets/VehicleSettings";
import { Model } from '../Objects/HelperObjects/Model';

export const Vehicle = ({ position = [0, 2, 0]}) => {
    const RAPIER = useRapier();
    const world = usePhysicsWorld();

    const forwardPressed = useKeyboardControls(state => state.forward);
    const backPressed = useKeyboardControls(state => state.back);
    const leftPressed = useKeyboardControls(state => state.left);
    const rightPressed = useKeyboardControls(state => state.right);

    const carModel = useRef();
    const cameraRef = useRef();

    const chassisRef = useRef();
    const chassisMeshRef = useRef();
    const wheelRefs = useRef([]);
    const vehicleRef = useRef();

    const chassisQ = new THREE.Quaternion();
    const connWorld = new THREE.Vector3();

    useEffect(() => {
        if (!RAPIER || !world) return;

        const chassisDesc = RAPIER.RigidBodyDesc
            .dynamic()
            .setTranslation(...position)
            .setLinearDamping(0.5);
        const chassis = world.createRigidBody(chassisDesc);
       

        const colliderDesc = RAPIER.ColliderDesc.cuboid(1, 0.25, 2);
        world.createCollider(colliderDesc, chassis);
        chassisRef.current = chassis;

        const vehicle = world.createVehicleController(chassis)
        vehicleRef.current = vehicle;
        

        const wheelOffsets = [
            {x: -1, y: -0.5, z: 1},
            {x: 1, y: -0.5, z: 1},
            {x: -1, y: -0.5, z: -1}, 
            {x: 1, y: -0.5, z: -1}   
        ];
        const directionCs = {x: 0, y: -1, z: 0};
        const axleCs = {x: -1, y: 0, z: 0};
        const suspensionRestLength = 0.3;
        const radius = 0.4;


        wheelOffsets.forEach((offset, wheelIndex) => {
            vehicle.addWheel(
                offset,
                directionCs,
                axleCs,
                suspensionRestLength,
                radius
            );

            vehicle.setWheelSuspensionStiffness(wheelIndex, defaultSettings.wheelSuspensionStiffness);
            vehicle.setWheelSuspensionRestLength(wheelIndex, defaultSettings.wheelSuspensionRestLength);
            vehicle.setWheelSuspensionCompression(wheelIndex, defaultSettings.wheelSuspensionCompression);
            vehicle.setWheelSuspensionRelaxation(wheelIndex, defaultSettings.wheelSuspensionRelaxation);
            vehicle.setWheelFrictionSlip(wheelIndex, defaultSettings.wheelFrictionSlip);
            vehicle.setWheelSideFrictionStiffness(wheelIndex, defaultSettings.wheelSideFrictionStiffness);
            vehicle.setWheelMaxSuspensionForce(wheelIndex, defaultSettings.wheelMaxSuspensionForce);
            vehicle.setWheelMaxSuspensionTravel(wheelIndex, defaultSettings.wheelMaxSuspensionTravel);
        });
    }, [RAPIER, world]);

    useFrame(() => {
        const vehicle = vehicleRef.current;
        const chassis = chassisRef.current;
        if (!vehicle || !chassis) return;

        const t = chassis.translation();
        const r = chassis.rotation();
        if (chassisMeshRef.current) {
            chassisMeshRef.current.position.set(t.x, t.y, t.z);
            chassisMeshRef.current.quaternion.set(r.x, r.y, r.z, r.w);
        }

        const engineForce = forwardPressed ? defaultSettings.engineForce : 0;
        const brakeForce = backPressed ? defaultSettings.brakeForce : 0;
        const steering = leftPressed ? defaultSettings.steeringForce : rightPressed ? -defaultSettings.steeringForce : 0;

        vehicle.setWheelEngineForce(2, engineForce);
        vehicle.setWheelEngineForce(3, engineForce);

        vehicle.setWheelBrake(2, brakeForce);
        vehicle.setWheelBrake(3, brakeForce);

        vehicle.setWheelSteering(0, steering);
        vehicle.setWheelSteering(1, steering);

        vehicle.updateVehicle(world.timestep);

        wheelRefs.current.forEach((wheelMesh, i) => {
            if (!wheelMesh) return;

            const conn = vehicle.wheelChassisConnectionPointCs(i);
            const suspension = vehicle.wheelSuspensionLength(i);
            const steering = vehicle.wheelSteering(i);
            const rotation = vehicle.wheelRotation(i);
            const axle = vehicle.wheelAxleCs(i);

            chassisQ.set(r.x, r.y, r.z, r.w);
            connWorld.set(conn.x, conn.y, conn.z);
            connWorld.applyQuaternion(chassisQ);

            wheelMesh.position.set(
                t.x + connWorld.x,
                t.y + connWorld.y - suspension,
                t.z + connWorld.z
            );
            wheelMesh.rotation.set(0, 0, (Math.PI / 2));
        });

        if (cameraRef.current) {
            const behindPos = new THREE.Vector3(0, 0, -8).applyQuaternion(chassisQ);
            const carPos = new THREE.Vector3(t.x, 1, t.z);
            const up = new THREE.Vector3(0, 1, 0);

            const cameraOffset = behindPos.add(up);
            const desiredPos = carPos.add(cameraOffset);

            cameraRef.current.position.lerp(desiredPos, 0.1);
            cameraRef.current.lookAt(t.x ,t.y, t.z);
        }

    });

    return (
        <>
            <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 15, 0]}/>
            <mesh ref={chassisMeshRef} castShadow>
                <Model name={"truck01"} type={"car"} ref={carModel} scale={[3, 3, 3]} rotation={[0, Math.PI, 0]} position={[0, -0.8, 0]}/>
                <meshStandardMaterial color="blue" />
            </mesh>
            {[0, 1, 2, 3].map((i) => (
                <mesh key={i} ref={(el) => (wheelRefs.current[i] = el)} castShadow>
                    <cylinderGeometry args={[0.4, 0.4, 0.2, 16]}/>
                    <meshStandardMaterial color="black" />
                </mesh>
            ))}
        </>
    );
}