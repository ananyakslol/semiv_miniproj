document.addEventListener('DOMContentLoaded', function() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const infoPanels = document.querySelectorAll('.info-panel');
    navTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        navTabs.forEach(t => t.classList.remove('active'));
        infoPanels.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        document.getElementById(this.getAttribute('data-tab')).classList.add('active');
      });
    });
  
    const container = document.getElementById('planet-model-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth/container.offsetHeight, 0.1, 1000);
    camera.position.z = 2.5;
    const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
  
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5,3,5);
    scene.add(dirLight);
  
    // Saturn sphere
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const texture = new THREE.TextureLoader().load('../img/p-saturn.png');
    const material = new THREE.MeshPhongMaterial({ map: texture });
    const saturn = new THREE.Mesh(geometry, material);
  
    // Saturn ring
    const ringGeometry = new THREE.RingGeometry(1.2, 1.8, 64);
    const ringTexture = new THREE.TextureLoader().load('../img/saturn-ring.png');
    const ringMaterial = new THREE.MeshBasicMaterial({ map: ringTexture, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0;
  
    // Group for planet + ring
    const group = new THREE.Group();
    group.add(saturn);
    group.add(ring);
    scene.add(group);
  
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 2;
    controls.maxDistance = 5;
  
    document.getElementById('rotate-left').onclick = () => group.rotation.y -= 0.5;
    document.getElementById('rotate-right').onclick = () => group.rotation.y += 0.5;
    document.getElementById('zoom-in').onclick = () => { if (camera.position.z > 2.1) camera.position.z -= 0.3; };
    document.getElementById('zoom-out').onclick = () => { if (camera.position.z < 5) camera.position.z += 0.3; };
    document.getElementById('reset-view').onclick = () => { camera.position.set(0,0,2.5); group.rotation.set(0,0,0); };
  
    function animate() {
      requestAnimationFrame(animate);
      group.rotation.y += 0.002;
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
  });
  