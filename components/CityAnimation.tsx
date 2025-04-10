"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

const CityAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f7); // Apple's signature light gray background

    // Use perspective camera for 3D effect
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // Position camera for isometric-like view
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Apple-quality rendering
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows for Apple-like quality
    containerRef.current.appendChild(renderer.domElement);

    // Apple-style ambient lighting - soft and even
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Add directional light that mimics Apple's product photography
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 20, 15);
    mainLight.castShadow = true;
    mainLight.shadow.camera.near = 1;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -20;
    mainLight.shadow.camera.right = 20;
    mainLight.shadow.camera.top = 20;
    mainLight.shadow.camera.bottom = -20;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.radius = 3; // Soften shadow edges
    scene.add(mainLight);

    // Create subtle gradient floor like Apple product showcases
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1, // Slightly glossy
      metalness: 0.1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Add subtle grid lines (thin Apple-style)
    const gridSize = 20;
    // Use subtle grid instead of THREE.GridHelper
    const gridGeometry = new THREE.PlaneGeometry(
      gridSize * 2,
      gridSize * 2,
      gridSize,
      gridSize
    );
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0xd1d1d6, // Apple's light gray
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
    gridMesh.rotation.x = -Math.PI / 2;
    gridMesh.position.y = 0.01; // Just above floor
    scene.add(gridMesh);

    // Apple-like cube properties
    const cubeSize = 0.8;
    const gap = 0.2;
    const totalSize = cubeSize + gap;
    const rows = 20;
    const cols = 20;
    const startX = -(cols * totalSize) / 2 + totalSize / 2;
    const startZ = -(rows * totalSize) / 2 + totalSize / 2;

    // Apple color palette
    const appleColors = [
      new THREE.Color(0x007aff), // Blue
      new THREE.Color(0x4cd964), // Green
      new THREE.Color(0xff2d55), // Pink
      new THREE.Color(0x5856d6), // Purple
      new THREE.Color(0xff9500), // Orange
    ];

    // Create cubes grid with Apple-like glass/aluminum finish
    const cubes = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Calculate position
        const x = startX + col * totalSize;
        const z = startZ + row * totalSize;

        // Random height for variety but keep it moderated for Apple elegance
        const maxHeight = 1 + Math.random() * 2;

        // Create rounded cube for Apple's rounded corner aesthetic
        const geometry = new THREE.BoxGeometry(cubeSize, maxHeight, cubeSize);

        // Apply Apple's product design colors - minimal with occasional color pops
        const useAccentColor = Math.random() < 0.15; // Only 15% get accent colors
        const color = useAccentColor
          ? appleColors[Math.floor(Math.random() * appleColors.length)]
          : new THREE.Color(0xffffff);

        // Create Apple-like material: either glass, aluminum, or accent color
        const material = new THREE.MeshPhysicalMaterial({
          color: color,
          transparent: true,
          opacity: 0,
          roughness: useAccentColor ? 0.3 : 0.1, // Glossy finish
          metalness: useAccentColor ? 0.1 : 0.5, // Aluminum-like for white
          clearcoat: useAccentColor ? 1.0 : 0.5, // Glass-like clearcoat
          clearcoatRoughness: 0.1,
          reflectivity: 1.0,
        });

        const cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        cube.receiveShadow = true;

        // Position cube with y at -maxHeight to hide it under the floor initially
        cube.position.set(x, -maxHeight, z);

        // Create pivot at the bottom of the cube for better animation
        const pivot = new THREE.Object3D();
        pivot.position.set(x, 0, z);
        pivot.add(cube);
        cube.position.y = -maxHeight / 2; // Offset to place bottom at pivot

        scene.add(pivot);

        // Store cube data for animation
        cubes.push({
          pivot,
          mesh: cube,
          row,
          col,
          x,
          z,
          maxHeight,
          targetY: -maxHeight / 2, // Target position (initially hidden)
          currentY: -maxHeight / 2, // Current position
          activated: false,
          targetOpacity: 0, // Start invisible
          currentOpacity: 0,
          animationSpeed: 0.07 + Math.random() * 0.03, // Slightly varied but consistent animation speed
          color,
          initialColor: color.clone(),
          isAccent: useAccentColor,
        });
      }
    }

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const mouseWorldPosition = new THREE.Vector3();

    // Handle mouse movement
    const handleMouseMove = (event) => {
      // Calculate normalized mouse position
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update mouse position in 3D space
      raycaster.setFromCamera(mouse, camera);
      const planeIntersection = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      raycaster.ray.intersectPlane(planeIntersection, mouseWorldPosition);

      // Activate cubes near mouse
      const mouseX = mouseWorldPosition.x;
      const mouseZ = mouseWorldPosition.z;
      const activationRadius = 5;

      cubes.forEach((cube) => {
        const distance = Math.sqrt(
          Math.pow(cube.x - mouseX, 2) + Math.pow(cube.z - mouseZ, 2)
        );

        if (distance < activationRadius) {
          // Calculate height based on distance from mouse with Apple-like smoothness
          const heightFactor = 1 - distance / activationRadius;
          // Apply cubic easing for Apple's signature smooth animations
          const easedFactor =
            heightFactor * heightFactor * (3 - 2 * heightFactor);
          cube.targetY = easedFactor * cube.maxHeight - cube.maxHeight / 2;

          // Apple UI tends to be either visible or not, with less half-states
          cube.targetOpacity = cube.isAccent
            ? 0.8 + 0.2 * easedFactor // Accent colors can be more opaque
            : 0.6 + 0.2 * easedFactor; // White cubes more translucent

          // Very subtle color shift - Apple doesn't do dramatic color changes
          if (!cube.isAccent) {
            // For white cubes, subtle warmth when activated
            cube.mesh.material.color.set(
              cube.initialColor
                .clone()
                .lerp(new THREE.Color(0xfefefe), easedFactor * 0.05)
            );
          }

          cube.activated = true;
        } else if (cube.activated) {
          // Apple's animations are swift but smooth when returning to rest state
          cube.targetY = -cube.maxHeight / 2;
          cube.targetOpacity = 0;
          cube.mesh.material.color.copy(cube.initialColor);
          cube.activated = false;
        }
      });
    };

    // Add mouse event listener
    containerRef.current.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smoothly interpolate cube positions and opacity - apple animations are buttery smooth
      cubes.forEach((cube) => {
        // Apple's animations have a consistent, refined timing function
        if (cube.currentY !== cube.targetY) {
          cube.currentY += (cube.targetY - cube.currentY) * 0.15; // Slightly faster for Apple responsiveness
          cube.mesh.position.y = cube.currentY;
        }

        // Smooth opacity transitions - Apple UI elements fade in/out cleanly
        if (cube.currentOpacity !== cube.targetOpacity) {
          cube.currentOpacity +=
            (cube.targetOpacity - cube.currentOpacity) * 0.15;
          cube.mesh.material.opacity = cube.currentOpacity;
        }

        // Add extremely subtle motion to active cubes - Apple's animations are rarely dramatic
        if (cube.activated) {
          const now = Date.now() * 0.0005; // Slow oscillation for subtlety
          const wave = Math.sin(now + cube.row * 0.1 + cube.col * 0.1) * 0.02; // Very small amplitude
          cube.mesh.position.y = cube.currentY + wave;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Camera animation for Apple product showcase style - slow, deliberate camera movement
    const cameraAnimation = () => {
      // Apple's camera movements are slow and deliberate
      camera.position.x = 15 + Math.sin(Date.now() * 0.0001) * 1; // Much slower, smaller movement
      camera.position.z = 15 + Math.cos(Date.now() * 0.00015) * 1;
      camera.lookAt(0, 0, 0);

      setTimeout(cameraAnimation, 20);
    };

    cameraAnimation();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      // Remove event listeners
      if (containerRef.current) {
        containerRef.current.removeEventListener("mousemove", handleMouseMove);
      }
      window.removeEventListener("resize", handleResize);

      // Stop animation
      cancelAnimationFrame(animationFrameId);

      // Clean up resources
      cubes.forEach((cube) => {
        cube.mesh.geometry.dispose();
        cube.mesh.material.dispose();
        scene.remove(cube.pivot);
      });

      // Clean up renderer
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-full z-0"
    />
  );
};

export default CityAnimation;
