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
    camera.position.z = 2;
    const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
  
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5,3,5);
    scene.add(dirLight);
  
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const texture = new THREE.TextureLoader().load('../img/p-venus.png');
    const material = new THREE.MeshPhongMaterial({ map: texture });
    const venus = new THREE.Mesh(geometry, material);
    scene.add(venus);
  
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 1.5;
    controls.maxDistance = 4;
  
    document.getElementById('rotate-left').onclick = () => venus.rotation.y -= 0.5;
    document.getElementById('rotate-right').onclick = () => venus.rotation.y += 0.5;
    document.getElementById('zoom-in').onclick = () => { if (camera.position.z > 1.6) camera.position.z -= 0.3; };
    document.getElementById('zoom-out').onclick = () => { if (camera.position.z < 4) camera.position.z += 0.3; };
    document.getElementById('reset-view').onclick = () => { camera.position.set(0,0,2); venus.rotation.set(0,0,0); };
  
    function animate() {
      requestAnimationFrame(animate);
      venus.rotation.y += 0.001;
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
  });
  