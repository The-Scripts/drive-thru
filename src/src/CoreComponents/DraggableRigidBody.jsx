import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { RigidBody, useSpringJoint } from "@react-three/rapier";
import React, {
    useState,
    useRef,
    useImperativeHandle,
    forwardRef,
} from "react";
import { CustomDragControls } from "./CustomDragControls";

export const DEFAULT_SPRING_JOINT_CONFIG = {
    restLength: 0,
    stiffness: 500,
    damping: 0,
    collisionGroups: 2,
};

const DraggableRigidBody = forwardRef((props, ref) => {
    const [isDragging, setIsDragging] = useState(false);
    const { scene } = useThree();

    const rigidBodyRef = useRef(null);
    const jointRigidBodyRef = useRef(null);

    const meshRef = useRef(null);
    const invisibleDragControlsMeshRef = useRef(null);

    useImperativeHandle(ref, () => ({
        getInvisibleMesh: () => invisibleDragControlsMeshRef.current,
        getVisibleMesh: () => meshRef.current,
    }));

    useSpringJoint(jointRigidBodyRef, rigidBodyRef, [
        [0, 0, 0],
        [0, 0, 0],
        props.jointConfig?.restLength ?? DEFAULT_SPRING_JOINT_CONFIG.restLength,
        props.jointConfig?.stiffness ?? DEFAULT_SPRING_JOINT_CONFIG.stiffness,
        props.jointConfig?.damping ?? DEFAULT_SPRING_JOINT_CONFIG.damping,
    ]);

    useFrame(() => {
        if (
            jointRigidBodyRef.current &&
            !jointRigidBodyRef.current.isSleeping() &&
            !isDragging
        ) {
            jointRigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, false);
            jointRigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, false);
        }

        if (
            !invisibleDragControlsMeshRef.current ||
            !meshRef.current ||
            isDragging ||
            rigidBodyRef.current?.bodyType() === 2 ||
            rigidBodyRef.current?.isSleeping()
        )
            return;

        const pmV = meshRef.current?.parent;
        const pmI = invisibleDragControlsMeshRef.current?.parent;

        if (!pmV || !pmI) return;

        scene.attach(meshRef.current);
        scene.attach(invisibleDragControlsMeshRef.current);

        const pos = meshRef.current.position;
        invisibleDragControlsMeshRef.current.position.set(pos.x, pos.y, pos.z);
        invisibleDragControlsMeshRef.current.setRotationFromEuler(
            meshRef.current.rotation
        );

        pmV.attach(meshRef.current);
        pmI.attach(invisibleDragControlsMeshRef.current);
    });

    const getBoxedPosition = (position) => {
        if (!props.boundingBox) return position;

        const box = props.boundingBox;

        if (box[0]) {
            position.setX(Math.min(Math.max(box[0][0], position.x), box[0][1]));
        }

        if (box[1]) {
            position.setY(Math.min(Math.max(box[1][0], position.y), box[1][1]));
        }

        if (box[2]) {
            position.setZ(Math.min(Math.max(box[2][0], position.z), box[2][1]));
        }

        return position;
    };

    const startDragging = () => {
        setIsDragging(true);

        if (jointRigidBodyRef.current) {
            jointRigidBodyRef.current.setBodyType(2, true);
            jointRigidBodyRef.current.wakeUp();
            return;
        }

        if (!rigidBodyRef.current) return;
        rigidBodyRef.current.setBodyType(2, true);
        rigidBodyRef.current.wakeUp();
    };

    const onDrag = () => {
        if (
            !isDragging ||
            !rigidBodyRef.current ||
            !invisibleDragControlsMeshRef.current
        )
            return;

        if (!props.enableSpringJoint && rigidBodyRef.current.bodyType() !== 2)
            return;
        if (
            props.enableSpringJoint &&
            jointRigidBodyRef.current &&
            jointRigidBodyRef.current.bodyType() !== 2
        )
            return;

        const position = new THREE.Vector3();
        invisibleDragControlsMeshRef.current.getWorldPosition(position);

        if (jointRigidBodyRef.current) {
            jointRigidBodyRef.current.setNextKinematicTranslation(position);
            return;
        }

        rigidBodyRef.current.setNextKinematicTranslation(
            getBoxedPosition(position)
        );
    };

    const stopDragging = () => {
        if (jointRigidBodyRef.current) {
            jointRigidBodyRef.current.setBodyType(0, true);
            setIsDragging(false);
            return;
        }

        if (!rigidBodyRef.current) return;
        rigidBodyRef.current.setBodyType(0, true);
        setIsDragging(false);
    };

    return (
        <group {...props.groupProps}>
            {props.enableSpringJoint && (
                <RigidBody
                    type={"dynamic"}
                    ref={jointRigidBodyRef}
                    collisionGroups={
                        props.jointConfig?.springJointCollisionGroups ??
                        DEFAULT_SPRING_JOINT_CONFIG.collisionGroups
                    }
                >
                    <mesh>
                        <boxGeometry args={[0.01, 0.01, 0.01]} />
                        <meshStandardMaterial visible={false} />
                    </mesh>
                </RigidBody>
            )}

            <CustomDragControls
                onDragStart={startDragging}
                onDrag={onDrag}
                onDragEnd={stopDragging}
                {...props.dragControlsProps}
            >
                {React.cloneElement(props.invisibleMesh ?? props.visibleMesh, {
                    ref: invisibleDragControlsMeshRef,
                    key: "invisible",
                    visible: false,
                })}
            </CustomDragControls>

            <RigidBody
                ref={rigidBodyRef}
                type={"dynamic"}
                colliders={"hull"}
                {...props.rigidBodyProps}
            >
                {React.cloneElement(props.visibleMesh, {
                    ref: meshRef,
                    key: "visible",
                })}
            </RigidBody>
        </group>
    );
});

export default DraggableRigidBody;
