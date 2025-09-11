import { useRapier } from "../CoreComponents/RapierContext";
import { usePhysicsWorld } from "../CoreComponents/PhysicsWorldContext";
import { useEffect, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';

export const Vehicle = ({ position = [0, 2, 0]}) => {
    const RAPIER = useRapier();
    const world = usePhysicsWorld();

    const forwardPressed = useKeyboardControls(state => state.forward);
    const backPressed = useKeyboardControls(state => state.back);
    const leftPressed = useKeyboardControls(state => state.left);
    const rightPressed = useKeyboardControls(state => state.right);

    const chassisRef = useRef();
    const chassisMeshRef = useRef();
    const wheelRefs = useRef([]);
    const vehicleRef = useRef();

    const chassisQ = new THREE.Quaternion();
    const connWorld = new THREE.Vector3();

    useEffect(() => {
        if (!RAPIER || !world) return;

        const chassisDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(...position);
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
        const suspensionRestLength = 0.3;
        const radius = 0.4;


        wheelOffsets.forEach((offset) => {
            vehicle.addWheel(
                offset,
                directionCs,
                {x: offset.x, y: 0, z: 0},
                suspensionRestLength,
                radius
            );
        });
    }, [RAPIER, world]);

    useFrame(() => {
        console.log({ forwardPressed, backPressed, leftPressed, rightPressed });

        const vehicle = vehicleRef.current;
        const chassis = chassisRef.current;
        if (!vehicle || !chassis) return;

        const t = chassis.translation();
        const r = chassis.rotation();
        if (chassisMeshRef.current) {
            chassisMeshRef.current.position.set(t.x, t.y, t.z);
            chassisMeshRef.current.quaternion.set(r.x, r.y, r.z, r.w);
        }

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
            /*
            const rotationQ = new THREE.Quaternion(axle.x, 0, 0, rotation);
            const steeringQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), steering);
           
            wheelMesh.quaternion.copy(rotationQ).multiply(steeringQ);

            console.log(wheelMesh.quaternion);*/
        });
    });

    return (
        <>
            <mesh ref={chassisMeshRef} castShadow>
                <boxGeometry args={[2, 0.5, 4]} />
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