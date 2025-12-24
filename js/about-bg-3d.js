// Professional DNA Helix + Geometric Grid 3D Background for About Page
// Creates a sophisticated, corporate-level visual

if (typeof THREE !== 'undefined') {
    const canvas = document.getElementById('about-3d-bg');

    if (canvas) {
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x0a0e14, 50, 200);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 20, 50);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // === DNA HELIX STRUCTURE ===
        const helixGroup = new THREE.Group();
        scene.add(helixGroup);

        const helixRadius = 8;
        const helixHeight = 80;
        const helixTurns = 6;
        const pointsPerHelix = 120;

        // Helix Strands (Two intertwined)
        const createHelixStrand = (offset = 0, color = 0x06b6d4) => {
            const geometry = new THREE.BufferGeometry();
            const positions = [];
            const colors = [];

            for (let i = 0; i < pointsPerHelix; i++) {
                const t = (i / pointsPerHelix) * helixHeight - helixHeight / 2;
                const angle = (i / pointsPerHelix) * Math.PI * 2 * helixTurns + offset;

                const x = Math.cos(angle) * helixRadius;
                const y = t;
                const z = Math.sin(angle) * helixRadius;

                positions.push(x, y, z);

                const col = new THREE.Color(color);
                colors.push(col.r, col.g, col.b);
            }

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: 0.4,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });

            return new THREE.Points(geometry, material);
        };

        const helix1 = createHelixStrand(0, 0x06b6d4);
        const helix2 = createHelixStrand(Math.PI, 0x8b5cf6);

        helixGroup.add(helix1);
        helixGroup.add(helix2);

        // Connection Lines between helixes (Rungs)
        const rungsGeometry = new THREE.BufferGeometry();
        const rungPositions = [];
        const rungCount = 40;

        for (let i = 0; i < rungCount; i++) {
            const t = (i / rungCount) * helixHeight - helixHeight / 2;
            const angle1 = (i / rungCount) * Math.PI * 2 * helixTurns;
            const angle2 = angle1 + Math.PI;

            const x1 = Math.cos(angle1) * helixRadius;
            const z1 = Math.sin(angle1) * helixRadius;
            const x2 = Math.cos(angle2) * helixRadius;
            const z2 = Math.sin(angle2) * helixRadius;

            rungPositions.push(x1, t, z1);
            rungPositions.push(x2, t, z2);
        }

        rungsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(rungPositions, 3));

        const rungsMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.15
        });

        const rungs = new THREE.LineSegments(rungsGeometry, rungsMaterial);
        helixGroup.add(rungs);

        // === FLOATING GEOMETRIC GRID ===
        const gridGroup = new THREE.Group();
        scene.add(gridGroup);

        // Create wireframe cubes
        const cubeGeo = new THREE.BoxGeometry(2, 2, 2);
        const edges = new THREE.EdgesGeometry(cubeGeo);

        const cubes = [];
        for (let i = 0; i < 20; i++) {
            const material = new THREE.LineBasicMaterial({
                color: i % 2 === 0 ? 0x06b6d4 : 0x8b5cf6,
                transparent: true,
                opacity: 0.3
            });

            const cube = new THREE.LineSegments(edges, material);
            cube.position.set(
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 60
            );
            cube.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            cube.userData = {
                rotSpeed: (Math.random() - 0.5) * 0.01,
                floatSpeed: Math.random() * 0.02
            };

            gridGroup.add(cube);
            cubes.push(cube);
        }

        // === AMBIENT PARTICLES ===
        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = 800;
        const particlePositions = [];
        const particleColors = [];

        for (let i = 0; i < particleCount; i++) {
            particlePositions.push(
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100
            );

            const col = Math.random() > 0.5 ? new THREE.Color(0x06b6d4) : new THREE.Color(0x8b5cf6);
            particleColors.push(col.r, col.g, col.b);
        }

        particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
        particlesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        // === MOUSE INTERACTION ===
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // === ANIMATION LOOP ===
        let time = 0;

        const animate = () => {
            requestAnimationFrame(animate);
            time += 0.01;

            // Rotate helix slowly
            helixGroup.rotation.y += 0.002;
            helixGroup.rotation.x = Math.sin(time * 0.2) * 0.1;

            // Animate cubes
            cubes.forEach(cube => {
                cube.rotation.x += cube.userData.rotSpeed;
                cube.rotation.y += cube.userData.rotSpeed;
                cube.position.y += Math.sin(time + cube.position.x) * 0.02;
            });

            // Gentle particle drift
            particles.rotation.y += 0.0005;

            // Camera responds to mouse
            camera.position.x += (mouseX * 10 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 10 + 20 - camera.position.y) * 0.05;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        };

        animate();

        // === RESIZE HANDLER ===
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
}
