import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface InteractiveGlobeProps {
  className?: string;
}

export const InteractiveGlobe: React.FC<InteractiveGlobeProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // WebGL support check
    const isWebGLAvailable = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
      } catch {
        return false;
      }
    };

    if (!isWebGLAvailable()) {
      setHasWebGL(false);
      return;
    }

    // Three.js Scene Setup
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Group for all Earth elements
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Core Sphere (Deep Dark Navy)
    const sphereGeometry = new THREE.SphereGeometry(65, 36, 36);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x061426,
      transparent: true,
      opacity: 0.95,
    });
    const coreSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    globeGroup.add(coreSphere);

    // 2. Wireframe / Longitude-Latitude Grid Mesh
    const wireframeGeometry = new THREE.WireframeGeometry(new THREE.SphereGeometry(65.4, 24, 20));
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0x168bff,
      transparent: true,
      opacity: 0.22,
    });
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    globeGroup.add(wireframe);

    // 3. Dot Grid / Point Cloud representing Global Continents & Network Nodes
    const pointCount = 1400;
    const pointPositions = new Float32Array(pointCount * 3);
    const pointColors = new Float32Array(pointCount * 3);
    const goldColor = new THREE.Color(0xd4af37);
    const blueColor = new THREE.Color(0x168bff);
    const cyanColor = new THREE.Color(0x00e5ff);

    for (let i = 0; i < pointCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / pointCount);
      const theta = Math.sqrt(pointCount * Math.PI) * phi;
      const radius = 66 + (Math.random() - 0.5) * 1.5;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      pointPositions[i * 3] = x;
      pointPositions[i * 3 + 1] = y;
      pointPositions[i * 3 + 2] = z;

      // Color distribution: blend gold and blue nodes
      const colorChoice = Math.random();
      const chosenColor = colorChoice > 0.75 ? goldColor : colorChoice > 0.4 ? blueColor : cyanColor;
      pointColors[i * 3] = chosenColor.r;
      pointColors[i * 3 + 1] = chosenColor.g;
      pointColors[i * 3 + 2] = chosenColor.b;
    }

    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(pointColors, 3));

    const pointsMaterial = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const globePoints = new THREE.Points(pointsGeometry, pointsMaterial);
    globeGroup.add(globePoints);

    // 4. Metallic Gold Orbital Rings
    const createRing = (radius: number, tubeRadius: number, colorHex: number, tiltX: number, tiltY: number) => {
      const ringGeo = new THREE.TorusGeometry(radius, tubeRadius, 8, 80);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = tiltX;
      ring.rotation.y = tiltY;
      return ring;
    };

    const goldRing1 = createRing(88, 0.6, 0xd4af37, Math.PI / 3, Math.PI / 6);
    const goldRing2 = createRing(98, 0.4, 0xf0d98a, -Math.PI / 4, Math.PI / 4);
    const blueRing = createRing(108, 0.35, 0x168bff, Math.PI / 6, -Math.PI / 3);

    scene.add(goldRing1);
    scene.add(goldRing2);
    scene.add(blueRing);

    // 5. Network Arcs Connecting Nodes
    const createArc = (startVec: THREE.Vector3, endVec: THREE.Vector3, arcColor: number) => {
      const mid = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
      const distance = startVec.distanceTo(endVec);
      mid.setLength(66 + distance * 0.4);

      const curve = new THREE.QuadraticBezierCurve3(startVec, mid, endVec);
      const curvePoints = curve.getPoints(24);
      const arcGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const arcMaterial = new THREE.LineBasicMaterial({
        color: arcColor,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      });
      return new THREE.Line(arcGeometry, arcMaterial);
    };

    // Add 6 connected planetary arcs
    const sampleNodes: THREE.Vector3[] = [
      new THREE.Vector3(45, 30, 35),
      new THREE.Vector3(-30, 40, 40),
      new THREE.Vector3(20, -45, 35),
      new THREE.Vector3(-45, -20, 35),
      new THREE.Vector3(55, -10, 25),
      new THREE.Vector3(-10, 50, 30),
    ];

    sampleNodes.forEach((node, idx) => {
      const nextNode = sampleNodes[(idx + 1) % sampleNodes.length];
      const arc = createArc(node, nextNode, idx % 2 === 0 ? 0xd4af37 : 0x00e5ff);
      globeGroup.add(arc);
    });

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 500;
      const newHeight = container.clientHeight || 500;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Interactive mouse tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - width / 2;
      const y = event.clientY - rect.top - height / 2;
      mouseX = (x / width) * 2;
      mouseY = (y / height) * 2;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow majestic continuous rotation
      globeGroup.rotation.y += 0.003;

      // Gentle interactive tilt towards mouse
      targetRotationX = mouseY * 0.35;
      targetRotationY = mouseX * 0.45;
      globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.05;

      // Orbiting rings counter-rotations
      goldRing1.rotation.z = elapsedTime * 0.12;
      goldRing2.rotation.z = -elapsedTime * 0.09;
      blueRing.rotation.z = elapsedTime * 0.07;

      // Subtle breathing pulse for points opacity
      pointsMaterial.opacity = 0.75 + Math.sin(elapsedTime * 2) * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);

      sphereGeometry.dispose();
      sphereMaterial.dispose();
      wireframeGeometry.dispose();
      wireframeMaterial.dispose();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      goldRing1.geometry.dispose();
      (goldRing1.material as THREE.Material).dispose();
      goldRing2.geometry.dispose();
      (goldRing2.material as THREE.Material).dispose();
      blueRing.geometry.dispose();
      (blueRing.material as THREE.Material).dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      {/* 3D Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full min-h-[380px] sm:min-h-[460px] flex items-center justify-center"
      />

      {/* Fallback Static Visual if WebGL is unavailable */}
      {!hasWebGL && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-64 h-64 rounded-full border-2 border-[#D4AF37]/40 bg-[#0A1B33]/80 backdrop-blur-md flex items-center justify-center shadow-gold-glow">
            <img
              src="/assets/images/pgot-logo.png"
              alt="Prasanth Group of Technologies Emblem"
              className="w-48 h-48 object-contain rounded-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};
