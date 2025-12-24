// Three.js Animated 3D Loader
// Designed to be "Heavy", "Tagda", and Futuristic

document.addEventListener('DOMContentLoaded', () => {
    // Determine if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded. Please ensure the CDN is included in index.html');
        return;
    }

    initHeavyLoader();
});

function initHeavyLoader() {
    const loaderContainer = document.getElementById('preloader');
    if (!loaderContainer) return;

    // CHECK: Has the site been visited in this session?
    if (sessionStorage.getItem('webnex_session_visited')) {
        loaderContainer.style.display = 'none';
        return;
    }

    // Set visited flag for current session
    sessionStorage.setItem('webnex_session_visited', 'true');

    // 1. Setup Container & Reset Styles
    loaderContainer.innerHTML = '';
    loaderContainer.style.display = 'block';
    loaderContainer.style.opacity = '1';
    loaderContainer.style.position = 'fixed';
    loaderContainer.style.top = '0';
    loaderContainer.style.left = '0';
    loaderContainer.style.width = '100%';
    loaderContainer.style.height = '100%';
    loaderContainer.style.zIndex = '100000'; // Topmost
    loaderContainer.style.background = '#000'; // Deep space black
    loaderContainer.style.overflow = 'hidden';

    // 2. Scene Setup
    const scene = new THREE.Scene();
    // No fog for maximum contrast

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize for high dpi
    loaderContainer.appendChild(renderer.domElement);

    // 3. Create Objects (The "Heavy" UI)

    // Group to hold everything
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // A. The Core (Glowing Sphere)
    const isMobile = window.innerWidth < 768;
    const coreSize = isMobile ? 2.5 : 4;
    const coreGeometry = new THREE.IcosahedronGeometry(coreSize, 2);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const coreSphere = new THREE.Mesh(coreGeometry, coreMaterial);
    mainGroup.add(coreSphere);

    // B. The Outer Shell (Complex Wireframe)
    const shellGeometry = new THREE.IcosahedronGeometry(10, 1);
    const shellMaterial = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6, // Violet
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const shellSphere = new THREE.Mesh(shellGeometry, shellMaterial);
    mainGroup.add(shellSphere);

    // C. Particle Ring (The "Orbit")
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 1500;
    const posArray = new Float32Array(particleCount * 3);
    const colorsArray = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x06b6d4); // Cyan
    const color2 = new THREE.Color(0xec4899); // Pink

    for (let i = 0; i < particleCount; i++) {
        // Spiral galaxy distribution
        const angle = Math.random() * Math.PI * 2;
        const radius = 12 + Math.random() * 8; // Ring between radius 12 and 20
        const spiralOffset = angle * 0.5;

        const x = Math.cos(angle + spiralOffset) * radius;
        const y = (Math.random() - 0.5) * 4; // Flat disc with some height
        const z = Math.sin(angle + spiralOffset) * radius;

        posArray[i * 3] = x;
        posArray[i * 3 + 1] = y;
        posArray[i * 3 + 2] = z;

        // Mixed colors
        const mixedColor = Math.random() > 0.5 ? color1 : color2;
        colorsArray[i * 3] = mixedColor.r;
        colorsArray[i * 3 + 1] = mixedColor.g;
        colorsArray[i * 3 + 2] = mixedColor.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    mainGroup.add(particleSystem);

    // D. Loading Text (2D Overlay on top of Canvas)
    const textDiv = document.createElement('div');
    textDiv.style.position = 'absolute';
    textDiv.style.top = '80%';
    textDiv.style.width = '100%';
    textDiv.style.padding = '0 20px';
    textDiv.style.textAlign = 'center';
    textDiv.style.color = '#fff';
    textDiv.style.fontFamily = "'Inter', sans-serif";
    textDiv.style.pointerEvents = 'none';
    textDiv.innerHTML = `
        <h2 style="font-weight: 300; letter-spacing: 5px; font-size: clamp(0.8rem, 2vw, 1.2rem); text-transform: uppercase;">Initializing Webnex</h2>
        <div style="width: min(300px, 80%); height: 2px; background: rgba(255,255,255,0.1); margin: 15px auto; overflow: hidden; border-radius: 2px;">
            <div id="loading-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #06b6d4, #8b5cf6); box-shadow: 0 0 15px #06b6d4;"></div>
        </div>
    `;
    loaderContainer.appendChild(textDiv);

    // 4. Animation Loop
    let time = 0;

    function animate() {
        if (!loaderContainer.offsetParent && loaderContainer.style.display === 'none') return; // Stop if hidden

        requestAnimationFrame(animate);
        time += 0.01;

        // Rotation
        coreSphere.rotation.y += 0.02;
        coreSphere.rotation.z += 0.01;

        shellSphere.rotation.y -= 0.005;
        shellSphere.rotation.x += 0.005;

        particleSystem.rotation.y = -time * 0.2;

        // Pulsing Core
        const scaleBase = 1;
        const scalePulse = Math.sin(time * 3) * 0.2;
        coreSphere.scale.setScalar(scaleBase + scalePulse);

        // Camera movement
        camera.position.x = Math.sin(time * 0.5) * 5;
        camera.position.y = Math.cos(time * 0.5) * 5;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    animate();

    // 5. Loading Simulation Logic
    const bar = document.getElementById('loading-bar');
    let progress = 0;

    const loadInterval = setInterval(() => {
        progress += Math.random() * 2; // Random speed
        if (progress > 100) progress = 100;

        if (bar) bar.style.width = progress + '%';

        if (progress === 100) {
            clearInterval(loadInterval);
            finishLoading();
        }
    }, 50);

    function finishLoading() {
        // Wait a small moment at 100% just for effect
        setTimeout(() => {
            gsap.to(loaderContainer, {
                opacity: 0,
                duration: 1,
                ease: "power2.inOut",
                onComplete: () => {
                    loaderContainer.style.display = 'none';
                    // Optional: Trigger any entrance animations on the main site here
                }
            });

            // Also scale up the scene for a "Jump to hyperspace" effect
            gsap.to(camera.position, {
                z: 0,
                duration: 1,
                ease: "expo.in"
            });
        }, 500);
    }

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
