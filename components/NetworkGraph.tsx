import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// --- Configuration ---
const NODE_RADIUS = 0.6;
const NODE_ADDITION_INTERVAL = 2000; // ms
const MAX_NODES = 60;
const NODE_SIZE_INCREASE_FACTOR = 1.02;

// --- Colors from LABirintar Palette ---
const COLOR_NODE_NEW = 0xff595a; // Accent Red
const COLOR_NODE_ESTABLISHED = 0xffa400; // Accent Orange/Yellow
const COLOR_EDGE = 0xaec5e7; // Accent Light Blue

type NetworkNode = {
    id: number;
    mesh: THREE.Mesh;
    body: CANNON.Body;
    isNew: boolean;
};

type NetworkEdge = {
    line: THREE.Line;
    constraint: CANNON.Constraint;
    node1Id: number;
    node2Id: number;
};

const NetworkGraph: React.FC = () => {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const worldRef = useRef<CANNON.World | null>(null);
    
    const nodesRef = useRef<NetworkNode[]>([]);
    const edgesRef = useRef<NetworkEdge[]>([]);
    const nextNodeIdRef = useRef<number>(0);
    
    const animationFrameIdRef = useRef<number | null>(null);
    const intervalIdRef = useRef<number | null>(null);

    useEffect(() => {
        // --- References to avoid dependency array issues ---
        const mount = mountRef.current;
        if (!mount) return;

        // --- Basic Scene Setup ---
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
        camera.position.set(0, 5, 25);
        cameraRef.current = camera;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // --- Controls ---
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 10;
        controls.maxDistance = 80;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.4;
        controlsRef.current = controls;

        // --- Lighting ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        // --- Physics World Setup ---
        const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0) });
        world.broadphase = new CANNON.NaiveBroadphase();
        (world.solver as CANNON.GSSolver).iterations = 10;
        const nodeMaterial = new CANNON.Material('nodeMaterial');
        const nodeContactMaterial = new CANNON.ContactMaterial(nodeMaterial, nodeMaterial, {
            friction: 0.1,
            restitution: 0.7,
        });
        world.addContactMaterial(nodeContactMaterial);
        worldRef.current = world;

        // --- Helper Functions ---
        const createNode = (position: THREE.Vector3, parentNode: NetworkNode | null = null): NetworkNode => {
            const nodeId = nextNodeIdRef.current++;
            const geometry = new THREE.SphereGeometry(NODE_RADIUS, 32, 32);
            const material = new THREE.MeshPhongMaterial({ color: parentNode ? COLOR_NODE_NEW : COLOR_NODE_ESTABLISHED, shininess: 30 });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(position);
            scene.add(mesh);

            const shape = new CANNON.Sphere(NODE_RADIUS);
            const body = new CANNON.Body({ mass: 1, position: new CANNON.Vec3(position.x, position.y, position.z), material: nodeMaterial });
            body.addShape(shape);
            world.addBody(body);
            
            const nodeObject: NetworkNode = { id: nodeId, mesh, body, isNew: !!parentNode };
            nodesRef.current.push(nodeObject);
            
            if (parentNode) {
                createEdge(nodeObject, parentNode);
                incrementNodeConnections(nodeObject);
                incrementNodeConnections(parentNode);

                // Transition color from new to established
                setTimeout(() => {
                    nodeObject.isNew = false;
                    (nodeObject.mesh.material as THREE.MeshPhongMaterial).color.setHex(COLOR_NODE_ESTABLISHED);
                }, 4000);
            }
            return nodeObject;
        };
        
        const createEdge = (node1: NetworkNode, node2: NetworkNode) => {
            const material = new THREE.LineBasicMaterial({ color: COLOR_EDGE, transparent: true, opacity: 0.7 });
            const geometry = new THREE.BufferGeometry().setFromPoints([node1.mesh.position, node2.mesh.position]);
            const line = new THREE.Line(geometry, material);
            scene.add(line);
            
            const distance = NODE_RADIUS * 4;
            const constraint = new CANNON.DistanceConstraint(node1.body, node2.body, distance, 150);
            world.addConstraint(constraint);
            
            edgesRef.current.push({ line, constraint, node1Id: node1.id, node2Id: node2.id });
        };
        
        const incrementNodeConnections = (node: NetworkNode) => {
            const connections = ((node.body as any).userData?.connections || 0) + 1;
            (node.body as any).userData = { connections };
            const scaleFactor = Math.pow(NODE_SIZE_INCREASE_FACTOR, connections);
            node.mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
            if (node.body.shapes[0] instanceof CANNON.Sphere) {
                node.body.shapes[0].radius = NODE_RADIUS * scaleFactor;
                node.body.updateBoundingRadius();
            }
        };
        
        const addRandomNode = () => {
            if (nodesRef.current.length >= MAX_NODES) return;
            
            const parentNode = nodesRef.current[Math.floor(Math.random() * nodesRef.current.length)];
            const offsetMultiplier = 9;
            const offset = new THREE.Vector3(
                (Math.random() - 0.5) * offsetMultiplier,
                (Math.random() - 0.5) * offsetMultiplier,
                (Math.random() - 0.5) * offsetMultiplier
            );
            
            const newPosition = new THREE.Vector3().copy(parentNode.mesh.position).add(offset);
            createNode(newPosition, parentNode);
        };

        const applyForces = () => {
            const centerAttractionForce = 0.005;
            const repulsionStrength = 3.0;
            const minRepulsionDistance = NODE_RADIUS * 8.0;

            for (let i = 0; i < nodesRef.current.length; i++) {
                const nodeA = nodesRef.current[i];
                // Force towards center
                const forceToCenter = nodeA.body.position.clone().negate().scale(centerAttractionForce * nodeA.body.mass);
                nodeA.body.applyForce(forceToCenter, nodeA.body.position);
                
                // Repulsion from other nodes
                for (let j = i + 1; j < nodesRef.current.length; j++) {
                    const nodeB = nodesRef.current[j];
                    const diff = new CANNON.Vec3();
                    nodeA.body.position.vsub(nodeB.body.position, diff);
                    const distance = diff.length();
                    
                    if (distance > 0.01 && distance < minRepulsionDistance) {
                        const isConnected = edgesRef.current.some(edge =>
                            (edge.node1Id === nodeA.id && edge.node2Id === nodeB.id) ||
                            (edge.node1Id === nodeB.id && edge.node2Id === nodeA.id)
                        );
                        if (!isConnected) {
                            const forceMagnitude = repulsionStrength / (distance * distance + 0.01);
                            diff.normalize();
                            const force = diff.scale(forceMagnitude);
                            nodeA.body.applyForce(force, nodeA.body.position);
                            nodeB.body.applyForce(force.negate(), nodeB.body.position);
                        }
                    }
                }
            }
        };

        // --- Animation Loop ---
        let lastTime = 0;
        const animate = (time: number) => {
            animationFrameIdRef.current = requestAnimationFrame(animate);
            const deltaTime = (time - lastTime) / 1000 || 1 / 60;
            lastTime = time;

            controls.update();
            applyForces();
            world.step(1 / 60, deltaTime, 3);

            for (const node of nodesRef.current) {
                node.mesh.position.copy(node.body.position as unknown as THREE.Vector3);
                node.mesh.quaternion.copy(node.body.quaternion as unknown as THREE.Quaternion);
            }

            for (const edge of edgesRef.current) {
                const node1 = nodesRef.current.find(n => n.id === edge.node1Id);
                const node2 = nodesRef.current.find(n => n.id === edge.node2Id);
                if (node1 && node2) {
                    const positions = edge.line.geometry.attributes.position;
                    positions.setXYZ(0, node1.mesh.position.x, node1.mesh.position.y, node1.mesh.position.z);
                    positions.setXYZ(1, node2.mesh.position.x, node2.mesh.position.y, node2.mesh.position.z);
                    positions.needsUpdate = true;
                }
            }
            renderer.render(scene, camera);
        };
        
        // --- Event Handlers & Intervals ---
        const handleResize = () => {
            if (mountRef.current && rendererRef.current && cameraRef.current) {
                const { clientWidth, clientHeight } = mountRef.current;
                rendererRef.current.setSize(clientWidth, clientHeight);
                cameraRef.current.aspect = clientWidth / clientHeight;
                cameraRef.current.updateProjectionMatrix();
            }
        };
        window.addEventListener('resize', handleResize);

        // --- Initial State ---
        createNode(new THREE.Vector3(0, 0, 0));
        intervalIdRef.current = window.setInterval(addRandomNode, NODE_ADDITION_INTERVAL);
        animate(0);

        // --- Cleanup ---
        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
            
            // Dispose Three.js objects
            if (sceneRef.current) {
                nodesRef.current.forEach(node => {
                    sceneRef.current?.remove(node.mesh);
                    node.mesh.geometry.dispose();
                    (node.mesh.material as THREE.Material).dispose();
                });
                edgesRef.current.forEach(edge => {
                    sceneRef.current?.remove(edge.line);
                    edge.line.geometry.dispose();
                    (edge.line.material as THREE.Material).dispose();
                });
            }

            if (rendererRef.current && mountRef.current) {
                mountRef.current.removeChild(rendererRef.current.domElement);
                rendererRef.current.dispose();
            }
            nodesRef.current = [];
            edgesRef.current = [];
        };
    }, []);

    return <div ref={mountRef} className="w-full flex-grow min-h-0" />;
};

export default NetworkGraph;