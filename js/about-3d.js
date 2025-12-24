// Advanced 3D Background for About Page
// Creates a floating particle network with depth

if (typeof THREE !== 'undefined') {
    const canvas = document.getElementById('about-3d-bg');

    if (canvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 700;

        const posArray = new Float32Array(particlesCount * 3);
        const sizesArray = new Float32Array(particlesCount);

        for (let i = 0; i < particlesCount * 3; i += 3) {
            // Spread particles across a wide area
            posArray[i] = (Math.random() - 0.5) * 40;     // x
            posArray[i + 1] = (Math.random() - 0.5) * 40;   // y
            posArray[i + 2] = (Math.random() - 0.5) * 40;   // z

            sizesArray[i / 3] = Math.random();
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizesArray, 1));

        // Material
        const material = new THREE.PointsMaterial({
            size: 0.15,
            color: 0x06b6d4,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, material);
        scene.add(particlesMesh);

        // Geometric Shapes Floating
        const shapesGroup = new THREE.Group();
        scene.add(shapesGroup);

        const geoGeometry = new THREE.IcosahedronGeometry(1, 0);
        const geoMaterial = new THREE.MeshBasicMaterial({
            color: 0x8b5cf6,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });

        for (let i = 0; i < 5; i++) {
            const mesh = new THREE.Mesh(geoGeometry, geoMaterial);
            mesh.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
            mesh.scale.setScalar(Math.random() * 2 + 1);
            shapesGroup.add(mesh);
        }

        camera.position.z = 15;

        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (event) => {
            mouseX = event.clientX / window.innerWidth - 0.5;
            mouseY = event.clientY / window.innerHeight - 0.5;
        });

        const animate = () => {
            requestAnimationFrame(animate);

            // Rotate entire system slightly
            particlesMesh.rotation.y += 0.001;
            particlesMesh.rotation.x += 0.001;

            shapesGroup.rotation.y -= 0.002;
            shapesGroup.rotation.x -= 0.002;

            // Mouse parallax
            particlesMesh.rotation.y += mouseX * 0.05;
            particlesMesh.rotation.x += mouseY * 0.05;

            renderer.render(scene, camera);
        };

        animate();

        // Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
}
