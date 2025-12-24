
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('contact-canvas');
    if (!canvas) return;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.002);

    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x06b6d4, 2, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 2, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // Objects - Creating a cool complex structure
    const geometry = new THREE.IcosahedronGeometry(10, 1);
    const material = new THREE.MeshPhongMaterial({
        color: 0x111111,
        emissive: 0x222222,
        specular: 0xffffff,
        shininess: 100,
        flatShading: true,
        wireframe: true
    });

    const core = new THREE.Mesh(geometry, material);
    scene.add(core);

    // Orbital Rings
    const ringGeo = new THREE.TorusGeometry(18, 0.2, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.3 });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    const ring3 = new THREE.Mesh(ringGeo, ringMat);

    ring1.rotation.x = Math.PI / 2;
    ring2.rotation.x = Math.PI / 2;
    ring2.rotation.y = Math.PI / 3;
    ring3.rotation.x = Math.PI / 2;
    ring3.rotation.y = -Math.PI / 3;

    scene.add(ring1);
    scene.add(ring2);
    scene.add(ring3);

    // Particles
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 1000;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
        size: 0.1,
        color: 0xffffff,
        transparent: true,
        opacity: 0.5
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    // Use a container for event listening if canvas is covered
    const container = canvas.parentElement;
    container.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    });

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);

        core.rotation.x += 0.002;
        core.rotation.y += 0.002;

        ring1.rotation.x += 0.005;
        ring1.rotation.y += 0.005;

        ring2.rotation.x += 0.005;
        ring2.rotation.y += 0.006;

        ring3.rotation.x += 0.005;
        ring3.rotation.y += 0.004;

        particlesMesh.rotation.y -= 0.001;

        // Interactive movement
        core.position.x += (mouseX * 5 - core.position.x) * 0.05;
        core.position.y += (mouseY * 5 - core.position.y) * 0.05;

        camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
});
