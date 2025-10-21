import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SPECIALTY_DATA, Specialty } from '../content/networkData';

const NODE_RADIUS_SPECIALTY = 1.2;
const NODE_RADIUS_SPECIALIST = 0.5;
const REPULSION_STRENGTH = 1.5; // Reduced for smoother animation
const CENTER_ATTRACTION = 0.02; // Slightly increased to keep graph centered
const BRIDGE_EDGE_DISTANCE = 20;

const COLOR_SPECIALTY = 0xffa400; // Accent Orange/Yellow
const COLOR_SPECIALIST = 0xff595a; // Accent Red
const COLOR_EDGE = 0xaec5e7; // Accent Light Blue

type NetworkNode = {
    id: string;
    mesh: THREE.Mesh;
    body: CANNON.Body;
    isSpecialty: boolean;
    specialtyId?: string; // To link specialists to their specialty
};

type NetworkEdge = {
    line: THREE.Line;
    constraint: CANNON.Constraint;
};

interface SpecialistNetworkGraphProps {
    onSpecialtyClick: (content: string) => void;
    isPreview?: boolean;
    searchQuery?: string;
}

const createTextSprite = (text: string, fontSize: number = 24, textColor: string = '#ffffff') => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return new THREE.Sprite();

    const font = `Bold ${fontSize}px Arvo, serif`;
    context.font = font;
    const metrics = context.measureText(text);
    const textWidth = metrics.width;
    
    canvas.width = textWidth + 20; // padding
    canvas.height = fontSize + 10; // padding

    // Re-apply font after resizing canvas
    context.font = font;
    context.fillStyle = 'rgba(0, 0, 0, 0.4)';
    context.roundRect(0, 0, canvas.width, canvas.height, 8);
    context.fill();
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = textColor;
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(canvas.width * 0.05, canvas.height * 0.05, 1.0);
    sprite.userData = { isLabel: true };
    return sprite;
};


const SpecialistNetworkGraph: React.FC<SpecialistNetworkGraphProps> = ({ onSpecialtyClick, isPreview = false, searchQuery = '' }) => {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const nodesRef = useRef<NetworkNode[]>([]);
    const edgesRef = useRef<NetworkEdge[]>([]);
    const animationFrameIdRef = useRef<number | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    
    const cameraRef = useRef<THREE.PerspectiveCamera>();
    const sceneRef = useRef<THREE.Scene>();
    const raycasterRef = useRef(new THREE.Raycaster());
    const mouseRef = useRef(new THREE.Vector2());

    useEffect(() => {
        const lowerCaseQuery = searchQuery.toLowerCase().trim();
        if (!nodesRef.current.length) return;

        const matchingSpecialtyIds = new Set<string>();
        if (lowerCaseQuery === '') {
            SPECIALTY_DATA.forEach(s => matchingSpecialtyIds.add(s.id));
        } else {
            SPECIALTY_DATA.forEach(specialty => {
                if (specialty.name.toLowerCase().includes(lowerCaseQuery)) {
                    matchingSpecialtyIds.add(specialty.id);
                }
            });
        }

        nodesRef.current.forEach(node => {
            const material = node.mesh.material as THREE.MeshPhongMaterial;
            const isMatch = node.isSpecialty ? matchingSpecialtyIds.has(node.id) : (node.specialtyId ? matchingSpecialtyIds.has(node.specialtyId) : false);

            material.transparent = true;
            material.opacity = isMatch ? 1.0 : 0.1;

            node.mesh.children.forEach(child => {
                if (child instanceof THREE.Sprite) {
                    (child.material as THREE.SpriteMaterial).opacity = isMatch ? 1.0 : 0.05;
                }
            });
        });

        edgesRef.current.forEach(edge => {
            const constraint = edge.constraint as CANNON.DistanceConstraint;
            const nodeA = nodesRef.current.find(n => n.body.id === constraint.bodyA.id);
            const nodeB = nodesRef.current.find(n => n.body.id === constraint.bodyB.id);
            const material = edge.line.material as THREE.LineBasicMaterial;
            
            const isNodeAMatch = nodeA?.isSpecialty ? matchingSpecialtyIds.has(nodeA.id) : (nodeA?.specialtyId ? matchingSpecialtyIds.has(nodeA.specialtyId) : false);
            const isNodeBMatch = nodeB?.isSpecialty ? matchingSpecialtyIds.has(nodeB.id) : (nodeB?.specialtyId ? matchingSpecialtyIds.has(nodeB.specialtyId) : false);

            material.opacity = (isNodeAMatch && isNodeBMatch) ? 0.6 : 0.05;
        });

    }, [searchQuery]);


    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // --- Basic Scene Setup ---
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
        camera.position.set(0, isPreview ? 10 : 15, isPreview ? 25 : 30);
        cameraRef.current = camera;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // --- Controls ---
        const controls = new OrbitControls(camera, renderer.domElement);
        if (isPreview) {
            controls.enabled = false;
            controls.autoRotate = true;
            controls.autoRotateSpeed = 1.0;
        } else {
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.minDistance = 10;
            controls.maxDistance = 80;
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.3;
        }


        // --- Lighting ---
        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
        dirLight.position.set(5, 10, 7.5);
        scene.add(dirLight);

        // --- Physics World Setup ---
        const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0) });
        world.broadphase = new CANNON.NaiveBroadphase();
        (world.solver as CANNON.GSSolver).iterations = 10;
        const nodeMaterial = new CANNON.Material('nodeMaterial');
        const nodeContactMaterial = new CANNON.ContactMaterial(nodeMaterial, nodeMaterial, { friction: 0.1, restitution: 0.7 });
        world.addContactMaterial(nodeContactMaterial);

        // --- Materials & Geometries (reusable) ---
        const specialtyMaterial = new THREE.MeshPhongMaterial({ color: COLOR_SPECIALTY, shininess: 30, transparent: true });
        const specialistMaterial = new THREE.MeshPhongMaterial({ color: COLOR_SPECIALIST, shininess: 30, transparent: true });
        const specialtyGeometry = new THREE.SphereGeometry(NODE_RADIUS_SPECIALTY, 32, 16);
        const specialistGeometry = new THREE.SphereGeometry(NODE_RADIUS_SPECIALIST, 16, 8);
        const edgeMaterial = new THREE.LineBasicMaterial({ color: COLOR_EDGE, transparent: true, opacity: 0.6 });

        // --- Helper Functions ---
        const createNode = (id: string, position: THREE.Vector3, isSpecialty: boolean, data?: Specialty): NetworkNode => {
            const radius = isSpecialty ? NODE_RADIUS_SPECIALTY : NODE_RADIUS_SPECIALIST;
            const geometry = isSpecialty ? specialtyGeometry : specialistGeometry;
            const material = isSpecialty ? specialtyMaterial.clone() : specialistMaterial.clone();
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(position);
            mesh.userData = { id, isSpecialty, data };
            
            if (isSpecialty && data && !isPreview) {
                const textSprite = createTextSprite(data.name);
                textSprite.position.y = NODE_RADIUS_SPECIALTY + 0.5;
                mesh.add(textSprite); // Attach sprite to mesh
            }

            scene.add(mesh);

            const shape = new CANNON.Sphere(radius);
            const body = new CANNON.Body({ 
                mass: isSpecialty ? 5 : 1, 
                position: new CANNON.Vec3(position.x, position.y, position.z), 
                material: nodeMaterial,
                linearDamping: 0.7, // Add damping for stability
                angularDamping: 0.7 
            });
            body.addShape(shape);
            world.addBody(body);
            
            const nodeObject: NetworkNode = { id, mesh, body, isSpecialty, specialtyId: isSpecialty ? id : data?.id };
            nodesRef.current.push(nodeObject);
            return nodeObject;
        };
        
        const createEdge = (node1: NetworkNode, node2: NetworkNode, distance: number) => {
            const geometry = new THREE.BufferGeometry().setFromPoints([node1.mesh.position, node2.mesh.position]);
            const line = new THREE.Line(geometry, edgeMaterial.clone());
            scene.add(line);
            
            const constraint = new CANNON.DistanceConstraint(node1.body, node2.body, distance, 100);
            world.addConstraint(constraint);
            
            edgesRef.current.push({ line, constraint });
        };
        
        const applyForces = () => {
             for (let i = 0; i < nodesRef.current.length; i++) {
                const nodeA = nodesRef.current[i];
                const forceToCenter = nodeA.body.position.clone().negate().scale(CENTER_ATTRACTION * nodeA.body.mass);
                nodeA.body.applyForce(forceToCenter, nodeA.body.position);
                
                for (let j = i + 1; j < nodesRef.current.length; j++) {
                    const nodeB = nodesRef.current[j];
                    const diff = new CANNON.Vec3();
                    nodeA.body.position.vsub(nodeB.body.position, diff);
                    const distance = diff.length();
                    
                    if (distance > 0.1) {
                        const forceMagnitude = REPULSION_STRENGTH / (distance * distance);
                        diff.normalize();
                        const force = diff.scale(forceMagnitude);
                        nodeA.body.applyForce(force, nodeA.body.position);
                        nodeB.body.applyForce(force.negate(), nodeB.body.position);
                    }
                }
            }
        };

        // --- Build Graph from Data ---
        const specialtyNodesMap = new Map<string, NetworkNode>();
        const specialistsBySpecialty = new Map<string, NetworkNode[]>();

        SPECIALTY_DATA.forEach((specialtyData, i) => {
            const angle = (i / SPECIALTY_DATA.length) * Math.PI * 2;
            const radius = 15;
            const position = new THREE.Vector3(Math.cos(angle) * radius, (Math.random() - 0.5) * 5, Math.sin(angle) * radius);
            const specialtyNode = createNode(specialtyData.id, position, true, specialtyData);
            specialtyNodesMap.set(specialtyData.id, specialtyNode);

            const specialistNodes: NetworkNode[] = [];
            specialtyData.specialists.forEach((specialistData, j) => {
                const sAngle = (j / specialtyData.specialists.length) * Math.PI * 2;
                const sRadius = 5 + Math.random() * 2;
                const sPosition = new THREE.Vector3(
                    position.x + Math.cos(sAngle) * sRadius,
                    position.y + (Math.random() - 0.5) * 4,
                    position.z + Math.sin(sAngle) * sRadius
                );
                const specialistNode = createNode(specialistData.id, sPosition, false, specialtyData);
                specialistNode.specialtyId = specialtyData.id;
                specialistNodes.push(specialistNode);
                createEdge(specialtyNode, specialistNode, sRadius);
            });
            
            specialistsBySpecialty.set(specialtyData.id, specialistNodes);

            for(let k = 0; k < specialistNodes.length; k++) {
                for(let l = k + 1; l < specialistNodes.length; l++) {
                    if (Math.random() > 0.5) { 
                        createEdge(specialistNodes[k], specialistNodes[l], 4);
                    }
                }
            }
        });
        
        const specialtyIds = Array.from(specialistsBySpecialty.keys());
        if (specialtyIds.length > 1) {
            let connections = 0;
            const maxConnections = specialtyIds.length * 2; // Ensure enough connections
            const connectedSpecialties = new Set<string>();

            // Connect a chain first to guarantee one component
            for (let i = 0; i < specialtyIds.length -1; i++) {
                const currentSpecialtyId = specialtyIds[i];
                const nextSpecialtyId = specialtyIds[i + 1];
                 const specialistsA = specialistsBySpecialty.get(currentSpecialtyId);
                 const specialistsB = specialistsBySpecialty.get(nextSpecialtyId);
                if (specialistsA && specialistsA.length > 0 && specialistsB && specialistsB.length > 0) {
                    const nodeA = specialistsA[Math.floor(Math.random() * specialistsA.length)];
                    const nodeB = specialistsB[Math.floor(Math.random() * specialistsB.length)];
                    createEdge(nodeA, nodeB, BRIDGE_EDGE_DISTANCE);
                    connections++;
                }
            }


            // Add more random connections for robustness
            while(connections < maxConnections) {
                const idx1 = Math.floor(Math.random() * specialtyIds.length);
                let idx2 = Math.floor(Math.random() * specialtyIds.length);
                if(idx1 === idx2) continue;

                const specialistsA = specialistsBySpecialty.get(specialtyIds[idx1]);
                const specialistsB = specialistsBySpecialty.get(specialtyIds[idx2]);

                 if (specialistsA && specialistsA.length > 0 && specialistsB && specialistsB.length > 0) {
                    const nodeA = specialistsA[Math.floor(Math.random() * specialistsA.length)];
                    const nodeB = specialistsB[Math.floor(Math.random() * specialistsB.length)];
                    createEdge(nodeA, nodeB, BRIDGE_EDGE_DISTANCE * (1 + Math.random() * 0.5));
                    connections++;
                }
            }
        }

        // --- Animation Loop ---
        let lastTime = 0;
        const animate = (time: number) => {
            animationFrameIdRef.current = requestAnimationFrame(animate);
            const deltaTime = (time - lastTime) / 1000 || 1 / 60;
            lastTime = time;

            controls.update();
            applyForces();
            world.step(1 / 60, deltaTime, 3);

            nodesRef.current.forEach(node => {
                node.mesh.position.copy(node.body.position as unknown as THREE.Vector3);
                node.mesh.quaternion.copy(node.body.quaternion as unknown as THREE.Quaternion);
            });

            edgesRef.current.forEach(edge => {
                const constraint = edge.constraint as CANNON.DistanceConstraint;
                const nodeA = nodesRef.current.find(n => n.body.id === constraint.bodyA.id);
                const nodeB = nodesRef.current.find(n => n.body.id === constraint.bodyB.id);
                 if (nodeA && nodeB) {
                    const positions = edge.line.geometry.attributes.position as THREE.BufferAttribute;
                    positions.setXYZ(0, nodeA.mesh.position.x, nodeA.mesh.position.y, nodeA.mesh.position.z);
                    positions.setXYZ(1, nodeB.mesh.position.x, nodeB.mesh.position.y, nodeB.mesh.position.z);
                    positions.needsUpdate = true;
                }
            });
            renderer.render(scene, camera);
        };
        
        // --- Event Handlers ---
        const handleResize = () => {
            if (mountRef.current && rendererRef.current && cameraRef.current) {
                const { clientWidth, clientHeight } = mountRef.current;
                rendererRef.current.setSize(clientWidth, clientHeight);
                cameraRef.current.aspect = clientWidth / clientHeight;
                cameraRef.current.updateProjectionMatrix();
            }
        };

        const handleClick = (event: MouseEvent) => {
            if (!mountRef.current || !cameraRef.current || !sceneRef.current || isPreview) return;
            
            if(controls.autoRotate) {
                controls.autoRotate = false;
            }

            const rect = mountRef.current.getBoundingClientRect();
            mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

            const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);

            for (const intersect of intersects) {
                let targetObject = intersect.object;
                
                if (targetObject.userData.isLabel && targetObject.parent instanceof THREE.Mesh) {
                    targetObject = targetObject.parent;
                }

                if (targetObject instanceof THREE.Mesh && targetObject.userData.isSpecialty) {
                    const { userData } = targetObject;
                    if (userData.data && userData.data.content) {
                        const material = targetObject.material as THREE.MeshPhongMaterial;
                        if(material.opacity > 0.5) { // Only allow click on visible nodes
                           onSpecialtyClick(userData.data.content);
                           return; 
                        }
                    }
                }
            }
        };

        window.addEventListener('resize', handleResize);
        mount.addEventListener('click', handleClick);

        animate(0);

        // --- Cleanup ---
        return () => {
            window.removeEventListener('resize', handleResize);
            mount.removeEventListener('click', handleClick);
            if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
            
            nodesRef.current.forEach(node => {
                scene.remove(node.mesh);
                node.mesh.traverse(child => {
                    if (child instanceof THREE.Mesh || child instanceof THREE.Sprite) {
                        child.geometry?.dispose();
                        if (Array.isArray(child.material)) {
                            child.material.forEach(m => {
                                m.map?.dispose();
                                m.dispose()
                            });
                        } else if (child.material) {
                            (child.material as any).map?.dispose();
                            (child.material as THREE.Material).dispose();
                        }
                    }
                });
                world.removeBody(node.body);
            });
            edgesRef.current.forEach(edge => {
                scene.remove(edge.line);
                edge.line.geometry.dispose();
                (edge.line.material as THREE.Material).dispose();
                world.removeConstraint(edge.constraint);
            });
            
            if (rendererRef.current && mountRef.current?.contains(rendererRef.current.domElement)) {
                mountRef.current.removeChild(rendererRef.current.domElement)
            };
            rendererRef.current?.dispose();
            
            nodesRef.current = [];
            edgesRef.current = [];
        };
    }, [onSpecialtyClick, isPreview]);

    return <div ref={mountRef} className="w-full h-full" />;
};

export default SpecialistNetworkGraph;
