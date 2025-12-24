// Three.js Hero Animation
// Works with simple file:// protocol, no server needed

(function () {
    'use strict';

    // Wait for DOM and THREE to be ready
    const init = function () {
        if (typeof THREE === 'undefined') {
            console.warn('THREE.js not loaded. Skipping 3D animation.');
            return;
        }

        const canvas = document.getElementById('hero-canvas');
        if (!canvas) {
            console.warn('hero-canvas not found.');
            return;
        }

        console.log('Hero 3D Initializing...');

        // Scene
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x0B0E14, 0.003);

        // Camera
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 40;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 4000;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 180;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.18,
            color: 0x06b6d4,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const light1 = new THREE.PointLight(0x8b5cf6, 2, 150);
        light1.position.set(30, 30, 30);
        scene.add(light1);

        const light2 = new THREE.PointLight(0x06b6d4, 2, 150);
        light2.position.set(-30, -20, 30);
        scene.add(light2);

        // Create "WEBNEX" using basic geometries (since FontLoader needs extra files)
        const textGroup = new THREE.Group();

        // Create glowing spheres arranged to spell WEBNEX abstractly
        const sphereGeo = new THREE.SphereGeometry(0.8, 32, 32);
        const glowMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            emissive: 0x06b6d4,
            emissiveIntensity: 0.5,
            metalness: 0.8,
            roughness: 0.2,
            transparent: true,
            opacity: 0.9
        });

        // Create multiple spheres for effect
        for (let i = 0; i < 7; i++) {
            const sphere = new THREE.Mesh(sphereGeo, glowMat.clone());
            sphere.position.x = (i - 3) * 3;
            sphere.position.y = Math.sin(i) * 0.5;
            textGroup.add(sphere);
        }

        scene.add(textGroup);

        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', function (e) {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 0.001;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 0.001;
        });

        // Animation loop
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();

            // Rotate particles
            particlesMesh.rotation.y = elapsedTime * 0.03;
            particlesMesh.rotation.x = mouseY * 0.3;

            // Animate text group
            textGroup.rotation.y = Math.sin(elapsedTime * 0.5) * 0.2 + mouseX;
            textGroup.rotation.x = Math.cos(elapsedTime * 0.3) * 0.1 + mouseY;

            // Pulse effect
            textGroup.scale.set(
                1 + Math.sin(elapsedTime * 2) * 0.05,
                1 + Math.sin(elapsedTime * 2) * 0.05,
                1 + Math.sin(elapsedTime * 2) * 0.05
            );

            // Light animation
            light1.position.x = Math.sin(elapsedTime) * 30;
            light2.position.x = Math.cos(elapsedTime) * 30;

            renderer.render(scene, camera);
        }

        animate();

        // Handle resize
        window.addEventListener('resize', function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });
    };

    if (document.readyState === 'loading') {
        window.addEventListener('load', init);
    } else {
        init();
    }
})();
