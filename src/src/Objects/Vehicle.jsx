import { useRapier } from "../CoreComponents/RapierContext";
import { usePhysicsWorld } from "../CoreComponents/PhysicsWorldContext";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

import { defaultSettings } from "../EnviromentPresets/VehicleSettings";
import { Model } from '../Objects/HelperObjects/Model';

let canRecover = true;

function performRecoveryFlip(chassisRef) {
    const chassis = chassisRef.current;
    if (!chassis || !canRecover) return;

    canRecover = false;

    const r = chassis.rotation(); 
    const q = new THREE.Quaternion(r.x, r.y, r.z, r.w);

    const euler = new THREE.Euler().setFromQuaternion(q, "YXZ");
    const yaw = euler.y;

    const uprightQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0));

    chassis.setRotation({ x: uprightQ.x, y: uprightQ.y, z: uprightQ.z, w: uprightQ.w });
    chassis.applyImpulse({ x: 0, y: 20, z: 0 }, true);
    chassis.setAngvel({ x: 0, y: 0, z: 0 }, true);

    setTimeout(() => {
        canRecover = true;
    }, 1000);
}

export const Vehicle = ({ position = [0, 2, 0], ref = useRef()}) => {
    const RAPIER = useRapier();
    const world = usePhysicsWorld();

    const forwardPressed = useKeyboardControls(state => state.forward);
    const backPressed = useKeyboardControls(state => state.back);
    const leftPressed = useKeyboardControls(state => state.left);
    const rightPressed = useKeyboardControls(state => state.right);
    const brakePressed = useKeyboardControls(state => state.brake)
    const flipPressed = useKeyboardControls(state => state.flip)

    const carModel = useRef();
    const cameraRef = useRef();

    const chassisRef = useRef();
    const chassisMeshRef = useRef();
    const wheelRefs = [useRef(), useRef(), useRef(), useRef()];

    const chassisQ = new THREE.Quaternion();
    const connWorld = new THREE.Vector3();
    
    const vehicleRef = ref

    useEffect(() => {
        if (!RAPIER || !world) return;

        const chassisDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(...position)  
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

    useFrame((_state, delta, _xrFrame) => {
        delta *= 100;
        const vehicle = vehicleRef.current;
        const chassis = chassisRef.current;
        if (!vehicle || !chassis) return;

        const t = chassis.translation();
        const r = chassis.rotation();
        if (chassisMeshRef.current) {
            chassisMeshRef.current.position.set(t.x, t.y, t.z);
            chassisMeshRef.current.quaternion.set(r.x, r.y, r.z, r.w);
        }


        let engineForce = 0;
        let brakeForce = brakePressed ? defaultSettings.brakeForce * delta : 0;
        const steering = leftPressed ? defaultSettings.steeringForce * delta : rightPressed ? -defaultSettings.steeringForce : 0;

        if (forwardPressed) {
            engineForce = defaultSettings.engineForce * delta;
        } 
        else if (backPressed) {
            chassis.wakeUp();
            engineForce = -defaultSettings.engineForce * delta;
        } else if (!brakePressed) {
            brakeForce = 0.02 * delta;
        }

        vehicle.setWheelEngineForce(2, engineForce);
        vehicle.setWheelEngineForce(3, engineForce);

        vehicle.setWheelBrake(2, brakeForce);
        vehicle.setWheelBrake(3, brakeForce);

        vehicle.setWheelSteering(0, steering);
        vehicle.setWheelSteering(1, steering);

        if (flipPressed) {
            performRecoveryFlip(chassisRef);
        }

        //vehicle.updateVehicle(world.timestep);

        wheelRefs.forEach((wheelMesh, i) => {
            if (!wheelMesh.current) return;

            const conn = vehicle.wheelChassisConnectionPointCs(i);
            const suspension = vehicle.wheelSuspensionLength(i);

            chassisQ.set(r.x, r.y, r.z, r.w);
            connWorld.set(conn.x, conn.y, conn.z);
            connWorld.applyQuaternion(chassisQ);

            wheelMesh.current.position.set(
                t.x + connWorld.x,
                t.y + connWorld.y - suspension,
                t.z + connWorld.z
            );

            const wheelQ = new THREE.Quaternion();
            const steerQ = new THREE.Quaternion();
            const spinQ = new THREE.Quaternion();
            const initialQ = new THREE.Quaternion();

            initialQ.setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));
            steerQ.setFromAxisAngle(new THREE.Vector3(0, 1, 0), vehicle.wheelSteering(i));
            spinQ.setFromAxisAngle(new THREE.Vector3(0, 0, 1), vehicle.wheelRotation(i));

            wheelQ.copy(initialQ);
            wheelQ.multiply(steerQ);
            wheelQ.multiply(spinQ);
            wheelQ.premultiply(chassisQ);
            wheelMesh.current.quaternion.copy(wheelQ);
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
            <group>
                <Model name={"truck01"} type={"wheel"}  ref={wheelRefs[0]} scale={[0.015, 0.015, 0.015]}/>
                <Model name={"truck01"} type={"wheel"}  ref={wheelRefs[1]} scale={[0.015, 0.015, 0.015]}/>
                <Model name={"truck01"} type={"wheel"}  ref={wheelRefs[2]} scale={[0.015, 0.015, 0.015]}/>
                <Model name={"truck01"} type={"wheel"}  ref={wheelRefs[3]} scale={[0.015, 0.015, 0.015]}/>
            </group>
            
        </>
    );
}