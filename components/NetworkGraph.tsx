import React, { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SPECIALTY_DATA, Specialty, Specialist } from '../content/networkData';

const BASE_NODE_RADIUS_SPECIALIST = 0.5;
const REPULSION_STRENGTH = 10.0; 
const CENTER_ATTRACTION = 0.01;
const BRIDGE_EDGE_DISTANCE = 15; 
const BRIDGE_EDGE_STIFFNESS = 1;
const CLUSTER_COHESION_STRENGTH = 0.5; 
const CLUSTER_REPULSION_STRENGTH = 150.0;

const COLOR_SPECIALTY = 0xffa400; // Laranja
const COLOR_SPECIALIST = 0xff595a; // Goiaba
const COLOR_EXTERNAL_INDICATOR = 0xb2dcd5; // Menta
const COLOR_EDGE = 0xaec5e7; // Hortencia

type NetworkNode = {
    id: string;
    mesh: THREE.Mesh;
    body: CANNON.Body;
    isSpecialty: boolean; // Will be false for all physical nodes now
    specialtyId: string;
};

type FloatingLabel = {
    id: string;
    name: string;
    sprite: THREE.Sprite;
    memberIds: string[];
};

type NetworkEdge = {
    line: THREE.Line;
    constraint: CANNON.Constraint;
};

const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
};

// FIX: Pass isPreview as an argument to resolve scope issue.
const createTextSprite = (text: string, isPreview: boolean, fontSize: number = 24, textColor: string = '#ffffff', bgColor: string = 'rgba(0, 0, 0, 0.4)') => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return new THREE.Sprite();

    const font = `Bold ${fontSize}px Arvo, serif`;
    context.font = font;
    const metrics = context.measureText(text);
    const textWidth = metrics.width;
    
    canvas.width = textWidth + 20;
    canvas.height = fontSize + 10;

    context.font = font;
    context.fillStyle = bgColor;
    roundRect(context, 0, 0, canvas.width, canvas.height, 8);
    context.fill();
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = textColor;
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);
    const scaleFactor = isPreview ? 0.03 : 0.05;
    sprite.scale.set(canvas.width * scaleFactor, canvas.height * scaleFactor, 1.0);
    sprite.userData = { isLabel: true };
    return sprite;
};

interface SpecialistNetworkGraphProps {
    onSpecialtyClick: (content: string) => void;
    isPreview?: boolean;
    searchQuery?: string;
}

const SpecialistNetworkGraph: React.FC<SpecialistNetworkGraphProps> = ({ onSpecialtyClick, isPreview = false, searchQuery = '' }) => {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const nodesRef = useRef<NetworkNode[]>([]);
    const edgesRef = useRef<NetworkEdge[]>([]);
    const labelsRef = useRef<FloatingLabel[]>([]);
    const adjacencyListRef = useRef<Map<string, Set<string>>>(new Map());
    
    const animationFrameIdRef = useRef<number | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    
    const cameraRef = useRef<THREE.PerspectiveCamera>();
    const sceneRef = useRef<THREE.Scene>();
    const graphGroupRef = useRef<THREE.Group>();
    const raycasterRef = useRef(new THREE.Raycaster());
    const mouseRef = useRef(new THREE.Vector2());

    const isUserInteractingRef = useRef(false);
    const idleTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

    const allSpecialists = useMemo(() => SPECIALTY_DATA.flatMap(s => s.specialists.map(sp => ({ ...sp, specialtyId: s.id }))), []);

    const getNodeById = useCallback((id: string) => nodesRef.current.find(n => n.id === id), []);

    const buildAdjacencyList = useCallback(() => {
        const adj = new Map<string, Set<string>>();
        allSpecialists.forEach(s => adj.set(s.id, new Set()));

        allSpecialists.forEach(s1 => {
            if (s1.indicatedBy) {
                const indicator = allSpecialists.find(s2 => s2.name === s1.indicatedBy);
                if (indicator) {
                    adj.get(s1.id)?.add(indicator.id);
                    adj.get(indicator.id)?.add(s1.id);
                }
            }
        });
        adjacencyListRef.current = adj;
    }, [allSpecialists]);

    useEffect(() => {
        const lowerCaseQuery = searchQuery.toLowerCase().trim();
        if (!nodesRef.current.length) return;

        const highlightedLevels = new Map<string, number>();

        if (lowerCaseQuery) {
            const seedNodeIds = new Set<string>();
            SPECIALTY_DATA.forEach(specialty => {
                if (specialty.name.toLowerCase().includes(lowerCaseQuery)) {
                    specialty.specialists.forEach(s => seedNodeIds.add(s.id));
                }
            });
            allSpecialists.forEach(specialist => {
                if (specialist.name.toLowerCase().includes(lowerCaseQuery)) {
                    seedNodeIds.add(specialist.id);
                }
            });

            // BFS for degrees of connection
            const queue: { id: string; level: number }[] = [];
            seedNodeIds.forEach(id => {
                queue.push({ id, level: 0 });
                highlightedLevels.set(id, 0);
            });

            let head = 0;
            while(head < queue.length) {
                const { id: currentId, level: currentLevel } = queue[head++];
                if (currentLevel >= 1) continue; // Show only 1st degree connections

                const neighbors = adjacencyListRef.current.get(currentId);
                if (neighbors) {
                    neighbors.forEach(neighborId => {
                        if (!highlightedLevels.has(neighborId)) {
                            highlightedLevels.set(neighborId, currentLevel + 1);
                            queue.push({ id: neighborId, level: currentLevel + 1 });
                        }
                    });
                }
            }
        }

        const opacities: { [key: number]: number } = { 0: 1.0, 1: 1.0, 2: 0.95, 3: 0.9 };
        const isSearching = highlightedLevels.size > 0;

        nodesRef.current.forEach(node => {
            const material = node.mesh.material as THREE.MeshPhongMaterial;
            const level = highlightedLevels.get(node.id);
            const isHighlighted = level !== undefined;
            
            material.opacity = isSearching ? (isHighlighted ? opacities[level] : 0.1) : 1.0;
            node.mesh.children.forEach(child => {
                if (child instanceof THREE.Sprite) {
                    (child.material as THREE.SpriteMaterial).opacity = material.opacity > 0.15 ? 1.0 : 0.05;
                }
            });
        });
        
        labelsRef.current.forEach(label => {
            const isAnyMemberHighlighted = label.memberIds.some(id => highlightedLevels.has(id));
            label.sprite.material.opacity = isSearching ? (isAnyMemberHighlighted ? 1.0 : 0.05) : 1.0;
        });

        edgesRef.current.forEach(edge => {
            const constraint = edge.constraint as CANNON.DistanceConstraint;
            const nodeA = getNodeById(constraint.bodyA.userData.id);
            const nodeB = getNodeById(constraint.bodyB.userData.id);
            const material = edge.line.material as THREE.LineBasicMaterial;
            
            const isHighlighted = isSearching 
                ? (nodeA && nodeB && highlightedLevels.has(nodeA.id) && highlightedLevels.has(nodeB.id))
                : true;

            material.opacity = isHighlighted ? 0.8 : 0.05;
        });
    }, [searchQuery, allSpecialists, getNodeById]);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        isUserInteractingRef.current = true; // Start as "interacting" to allow initial physics to settle
        buildAdjacencyList();
        
        const degreeMap = new Map<string, number>();
        allSpecialists.forEach(s => {
            degreeMap.set(s.id, adjacencyListRef.current.get(s.id)?.size || 0);
        });

        const scene = new THREE.Scene();
        sceneRef.current = scene;
        scene.fog = new THREE.Fog(0x111111, 70, 150);

        const graphGroup = new THREE.Group();
        scene.add(graphGroup);
        graphGroupRef.current = graphGroup;

        const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
        cameraRef.current = camera;
        camera.position.z = 50; // Start far away, will be adjusted
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const controls = new OrbitControls(camera, renderer.domElement);
        if (isPreview) {
            controls.enabled = false;
        } else {
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.minDistance = 20;
            controls.maxDistance = 150;
        }
        
        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
        dirLight.position.set(5, 10, 7.5);
        scene.add(dirLight);

        const world = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0) });
        const nodeMaterial = new CANNON.Material('nodeMaterial');
        world.addContactMaterial(new CANNON.ContactMaterial(nodeMaterial, nodeMaterial, { friction: 0.3, restitution: 0.5 }));

        const specialistMaterial = new THREE.MeshPhongMaterial({ color: COLOR_SPECIALIST, shininess: 30, transparent: true });
        const externalMaterial = new THREE.MeshPhongMaterial({ color: COLOR_EXTERNAL_INDICATOR, shininess: 30, transparent: true });
        const edgeMaterial = new THREE.LineBasicMaterial({ color: COLOR_EDGE, transparent: true, opacity: 0.6 });
        
        const createSpecialistNode = (specialistData: Specialist, position: THREE.Vector3, specialtyId: string): NetworkNode => {
            const degree = degreeMap.get(specialistData.id) || 0;
            const radius = BASE_NODE_RADIUS_SPECIALIST + Math.log1p(degree) * 0.9;
            const geometry = new THREE.SphereGeometry(radius, 16, 8);
            const material = (specialistData.isExternal ? externalMaterial : specialistMaterial).clone();
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(position);
            mesh.userData = { id: specialistData.id, isSpecialty: false, data: specialistData };
            
            if (!isPreview) {
                const textSprite = createTextSprite(specialistData.name, isPreview, 18, '#f4f0e8');
                textSprite.position.y = radius + 0.3;
                mesh.add(textSprite);
            }
            graphGroup.add(mesh);
            
            const mass = 1 + Math.log1p(degree) * 3;
            const shape = new CANNON.Sphere(radius);
            const body = new CANNON.Body({ mass, material: nodeMaterial, linearDamping: 0.8, angularDamping: 0.8 });
            body.addShape(shape);
            body.position.set(position.x, position.y, position.z);
            body.userData = { id: specialistData.id };
            world.addBody(body);
            
            const nodeObject: NetworkNode = { id: specialistData.id, mesh, body, isSpecialty: false, specialtyId };
            nodesRef.current.push(nodeObject);
            return nodeObject;
        };
        
        const createEdge = (node1: NetworkNode, node2: NetworkNode, distance: number, stiffness: number) => {
            const geometry = new THREE.BufferGeometry().setFromPoints([node1.mesh.position, node2.mesh.position]);
            const line = new THREE.Line(geometry, edgeMaterial.clone());
            graphGroup.add(line);
            
            const constraint = new CANNON.DistanceConstraint(node1.body, node2.body, distance, stiffness);
            world.addConstraint(constraint);
            
            edgesRef.current.push({ line, constraint });
        };
        
        const applyForces = () => {
             for (let i = 0; i < nodesRef.current.length; i++) {
                const nodeA = nodesRef.current[i];
                const forceToCenter = nodeA.body.position.clone().negate().scale(CENTER_ATTRACTION * nodeA.body.mass);
                nodeA.body.applyForce(forceToCenter);
                
                for (let j = i + 1; j < nodesRef.current.length; j++) {
                    const nodeB = nodesRef.current[j];
                    const diff = new CANNON.Vec3();
                    nodeA.body.position.vsub(nodeB.body.position, diff);
                    const distanceSq = diff.lengthSquared();
                    
                    if (distanceSq > 0.01) {
                        const forceMagnitude = REPULSION_STRENGTH / distanceSq;
                        diff.normalize();
                        const force = diff.scale(forceMagnitude);
                        nodeA.body.applyForce(force);
                        nodeB.body.applyForce(force.negate());
                    }
                }
            }
            
            const centroidsData = labelsRef.current.map(label => {
                const memberNodes = label.memberIds.map(getNodeById).filter((n): n is NetworkNode => !!n);
                if (memberNodes.length === 0) return null;
                const centerOfMass = new CANNON.Vec3();
                memberNodes.forEach(node => centerOfMass.vadd(node.body.position, centerOfMass));
                centerOfMass.scale(1 / memberNodes.length, centerOfMass);
                return { center: centerOfMass, nodes: memberNodes };
            }).filter((c): c is { center: CANNON.Vec3; nodes: NetworkNode[]; } => !!c);

            // Cluster cohesion force
            centroidsData.forEach(({ center, nodes }) => {
                nodes.forEach(node => {
                    const force = center.vsub(node.body.position).scale(CLUSTER_COHESION_STRENGTH * node.body.mass);
                    node.body.applyForce(force);
                });
            });

            // Inter-cluster repulsion force
            for (let i = 0; i < centroidsData.length; i++) {
                for (let j = i + 1; j < centroidsData.length; j++) {
                    const { center: centerA, nodes: nodesA } = centroidsData[i];
                    const { center: centerB, nodes: nodesB } = centroidsData[j];

                    const diff = new CANNON.Vec3();
                    centerA.vsub(centerB, diff);
                    const distanceSq = diff.lengthSquared();

                    if (distanceSq > 1) { // Avoid extreme forces at close range
                        const forceMagnitude = CLUSTER_REPULSION_STRENGTH / distanceSq;
                        diff.normalize();
                        const force = diff.scale(forceMagnitude);
                        
                        nodesA.forEach(node => node.body.applyForce(force));
                        nodesB.forEach(node => node.body.applyForce(force.negate()));
                    }
                }
            }
        };

        const specialistNodesMap = new Map<string, NetworkNode>();

        SPECIALTY_DATA.forEach((specialtyData, i) => {
            const angle = (i / SPECIALTY_DATA.length) * Math.PI * 2;
            const radius = 25 + Math.random() * 5;
            const initialClusterPosition = new THREE.Vector3(Math.cos(angle) * radius, (Math.random() - 0.5) * 10, Math.sin(angle) * radius);
            
            if (!isPreview) {
                const labelSprite = createTextSprite(specialtyData.name, isPreview, 16, '#000000', 'rgba(255, 164, 0, 0.8)');
                graphGroup.add(labelSprite);
                labelsRef.current.push({
                    id: specialtyData.id,
                    name: specialtyData.name,
                    sprite: labelSprite,
                    memberIds: specialtyData.specialists.map(s => s.id),
                });
            }

            specialtyData.specialists.forEach((specialistData, j) => {
                const sAngle = (j / specialtyData.specialists.length) * Math.PI * 2;
                const sRadius = 3 + Math.random() * 1.5;
                const sPosition = new THREE.Vector3(
                    initialClusterPosition.x + Math.cos(sAngle) * sRadius,
                    initialClusterPosition.y + (Math.random() - 0.5) * 2,
                    initialClusterPosition.z + Math.sin(sAngle) * sRadius
                );
                const specialistNode = createSpecialistNode(specialistData, sPosition, specialtyData.id);
                specialistNodesMap.set(specialistData.id, specialistNode);
            });
        });
        
        allSpecialists.forEach(specialistData => {
            if (specialistData.indicatedBy) {
                const educatorNode = specialistNodesMap.get(specialistData.id);
                const indicatorNode = specialistNodesMap.get(allSpecialists.find(s => s.name === specialistData.indicatedBy)?.id || '');

                if (educatorNode && indicatorNode) {
                    createEdge(educatorNode, indicatorNode, BRIDGE_EDGE_DISTANCE, BRIDGE_EDGE_STIFFNESS);
                }
            }
        });

        const clock = new THREE.Clock();
        const animate = () => {
            animationFrameIdRef.current = requestAnimationFrame(animate);
            const deltaTime = Math.min(clock.getDelta(), 0.1);

            applyForces();
            world.step(1 / 60, deltaTime, 5);

            nodesRef.current.forEach(node => {
                node.mesh.position.lerp(new THREE.Vector3(node.body.position.x, node.body.position.y, node.body.position.z), 0.5);
            });

            labelsRef.current.forEach(label => {
                const memberNodes = label.memberIds.map(getNodeById).filter((n): n is NetworkNode => !!n);
                if (memberNodes.length > 0) {
                    if (memberNodes.length === 1) {
                        const singleNode = memberNodes[0];
                        const nodePosition = singleNode.mesh.position;
                        const nodeRadius = (singleNode.mesh.geometry as THREE.SphereGeometry).parameters.radius;
                        const labelPosition = new THREE.Vector3(
                            nodePosition.x,
                            nodePosition.y - nodeRadius - 0.5,
                            nodePosition.z
                        );
                        label.sprite.position.copy(labelPosition);
                    } else {
                        const centerOfMass = new THREE.Vector3();
                        memberNodes.forEach(node => centerOfMass.add(node.mesh.position));
                        centerOfMass.divideScalar(memberNodes.length);
                        label.sprite.position.copy(centerOfMass);
                    }
                }
            });

            edgesRef.current.forEach(edge => {
                const constraint = edge.constraint as CANNON.DistanceConstraint;
                const nodeA = getNodeById(constraint.bodyA.userData.id);
                const nodeB = getNodeById(constraint.bodyB.userData.id);
                 if (nodeA && nodeB) {
                    const positions = edge.line.geometry.attributes.position as THREE.BufferAttribute;
                    positions.setXYZ(0, nodeA.mesh.position.x, nodeA.mesh.position.y, nodeA.mesh.position.z);
                    positions.setXYZ(1, nodeB.mesh.position.x, nodeB.mesh.position.y, nodeB.mesh.position.z);
                    positions.needsUpdate = true;
                }
            });
            
            // Continuous auto-framing when user is idle
            if (!isUserInteractingRef.current && !isPreview) {
                const box = new THREE.Box3().setFromObject(graphGroup);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());

                if (size.x > 0.1 && size.y > 0.1) {
                    const fov = camera.fov * (Math.PI / 180);
                    const aspect = camera.aspect;
                    const distanceH = (size.y / 2) / Math.tan(fov / 2);
                    const distanceW = (size.x / 2) / (Math.tan(fov / 2) * aspect);
                    
                    const padding = 1.5;
                    const targetDistance = Math.max(distanceW, distanceH) * padding;

                    // Avoid getting too close
                    const finalDistance = Math.max(targetDistance, controls.minDistance);

                    const targetPosition = new THREE.Vector3(center.x, center.y, center.z + finalDistance);

                    camera.position.lerp(targetPosition, 0.02);
                    controls.target.lerp(center, 0.02);
                }
            }

            controls.update();
            renderer.render(scene, camera);
        };
        
        const handleResize = () => {
            if (mountRef.current && rendererRef.current && cameraRef.current) {
                const { clientWidth, clientHeight } = mountRef.current;
                rendererRef.current.setSize(clientWidth, clientHeight);
                cameraRef.current.aspect = clientWidth / clientHeight;
                cameraRef.current.updateProjectionMatrix();
            }
        };

        const handleClick = (event: MouseEvent) => {
             if (!mountRef.current || !cameraRef.current || !graphGroupRef.current || isPreview) return;
            
            const rect = mountRef.current.getBoundingClientRect();
            mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
            const intersects = raycasterRef.current.intersectObjects(graphGroupRef.current.children, true);

            for (const intersect of intersects) {
                let targetObject = intersect.object;
                 if (targetObject.userData.isLabel && targetObject.parent) {
                    targetObject = targetObject.parent;
                }

                if (targetObject instanceof THREE.Sprite && targetObject.userData.isLabel) {
                    const labelId = labelsRef.current.find(l => l.sprite === targetObject)?.id;
                    if (labelId) {
                        const specialty = SPECIALTY_DATA.find(s => s.id === labelId);
                        if (specialty && specialty.content && targetObject.material.opacity > 0.5) {
                            onSpecialtyClick(specialty.content);
                            return;
                        }
                    }
                }
            }
        };

        const onInteractionStart = () => { 
            isUserInteractingRef.current = true;
            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current); 
        };
        const onInteractionEnd = () => { 
            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current); 
            idleTimeoutRef.current = setTimeout(() => { isUserInteractingRef.current = false; }, 5000); 
        };

        // Start in idle mode after a short delay
        const initialSettleTimeout = setTimeout(() => {
            isUserInteractingRef.current = false;
        }, 3000);

        controls.addEventListener('start', onInteractionStart);
        controls.addEventListener('end', onInteractionEnd);
        window.addEventListener('resize', handleResize);
        mount.addEventListener('click', handleClick);

        animate();

        return () => {
            clearTimeout(initialSettleTimeout);
            controls.removeEventListener('start', onInteractionStart);
            controls.removeEventListener('end', onInteractionEnd);
            window.removeEventListener('resize', handleResize);
            mount.removeEventListener('click', handleClick);
            if(idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
            if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
            
            nodesRef.current.forEach(node => {
                graphGroupRef.current?.remove(node.mesh);
                node.mesh.traverse(child => {
                    if (child instanceof THREE.Mesh || child instanceof THREE.Sprite) {
                        child.geometry?.dispose();
                        (child.material as any)?.map?.dispose();
                        (child.material as any)?.dispose();
                    }
                });
                world.removeBody(node.body);
            });

            labelsRef.current.forEach(label => {
                 graphGroupRef.current?.remove(label.sprite);
                 label.sprite.material.map?.dispose();
                 label.sprite.material.dispose();
            });

            edgesRef.current.forEach(edge => {
                graphGroupRef.current?.remove(edge.line);
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
            labelsRef.current = [];
        };
    }, [onSpecialtyClick, isPreview, allSpecialists, buildAdjacencyList, getNodeById]);

    return <div ref={mountRef} className="w-full h-full" />;
};

export default SpecialistNetworkGraph;