document.addEventListener('DOMContentLoaded', function() {
    // Tab navigation
    const navTabs = document.querySelectorAll('.nav-tab');
    const infoPanels = document.querySelectorAll('.info-panel');
    
    navTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remove active class from all tabs and panels
        navTabs.forEach(t => t.classList.remove('active'));
        infoPanels.forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Show corresponding panel
        const panelId = this.getAttribute('data-tab');
        document.getElementById(panelId).classList.add('active');
      });
    });
    
    // Compare button functionality
    const compareBtn = document.querySelector('.compare-btn');
    const planetComparison = document.querySelector('.planet-comparison');
    
    compareBtn.addEventListener('click', function() {
      if (planetComparison.style.display === 'none') {
        // Simulate loading comparison data
        planetComparison.innerHTML = '<div class="loading">Loading comparison data...</div>';
        planetComparison.style.display = 'block';
        
        setTimeout(() => {
          planetComparison.innerHTML = `
            <h3>Earth compared to other planets</h3>
            <div class="comparison-grid">
              <div class="comparison-item">
                <div class="planet-icon mercury"></div>
                <div class="comparison-data">
                  <div class="comparison-label">Mercury</div>
                  <div class="comparison-value">38% Earth's size</div>
                  <div class="comparison-bar" style="width: 38%"></div>
                </div>
              </div>
              <div class="comparison-item">
                <div class="planet-icon venus"></div>
                <div class="comparison-data">
                  <div class="comparison-label">Venus</div>
                  <div class="comparison-value">95% Earth's size</div>
                  <div class="comparison-bar" style="width: 95%"></div>
                </div>
              </div>
              <div class="comparison-item">
                <div class="planet-icon mars"></div>
                <div class="comparison-data">
                  <div class="comparison-label">Mars</div>
                  <div class="comparison-value">53% Earth's size</div>
                  <div class="comparison-bar" style="width: 53%"></div>
                </div>
              </div>
              <div class="comparison-item">
                <div class="planet-icon jupiter"></div>
                <div class="comparison-data">
                  <div class="comparison-label">Jupiter</div>
                  <div class="comparison-value">1120% Earth's size</div>
                  <div class="comparison-bar" style="width: 100%"></div>
                </div>
              </div>
            </div>
          `;
        }, 1500);
      } else {
        planetComparison.style.display = 'none';
      }
    });
    
    // Sound toggle
    const soundToggle = document.getElementById('sound-toggle');
    let audioPlaying = false;
    let earthAudio;
    
    soundToggle.addEventListener('click', function() {
      if (!audioPlaying) {
        // Create audio if it doesn't exist
        if (!earthAudio) {
          earthAudio = new Audio('../sounds/earth-ambience.mp3');
          earthAudio.loop = true;
        }
        
        earthAudio.play();
        audioPlaying = true;
        soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
      } else {
        earthAudio.pause();
        audioPlaying = false;
        soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
      }
    });
    
    // Fullscreen toggle
    const fullscreenToggle = document.getElementById('fullscreen-toggle');
    
    fullscreenToggle.addEventListener('click', function() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
    
    // Initialize 3D Earth model with Three.js
    initEarthModel();
  });
  
  function initEarthModel() {
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(document.getElementById('planet-model-container').offsetWidth, 
                    document.getElementById('planet-model-container').offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('planet-model-container').appendChild(renderer.domElement);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
    // Create Earth sphere
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    
    // Load Earth textures
    const textureLoader = new THREE.TextureLoader();
    
    const earthMap = textureLoader.load('/img/earth_map.jpg');
    const earthBump = textureLoader.load('/img/earth_bump.jpg');
    const earthSpec = textureLoader.load('/img/earth_spec.jpg');
    const earthClouds = textureLoader.load('/img/earth_clouds.png');
    
    // Create Earth material
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthMap,
      bumpMap: earthBump,
      bumpScale: 0.05,
      specularMap: earthSpec,
      specular: new THREE.Color(0x333333)
    });
    
    // Create Earth mesh
    const earth = new THREE.Mesh(geometry, earthMaterial);
    scene.add(earth);
    
    // Create cloud layer
    const cloudGeometry = new THREE.SphereGeometry(1.01, 64, 64);
    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: earthClouds,
      transparent: true,
      opacity: 0.8
    });
    
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(clouds);
    
    // Add OrbitControls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 1.5;
    controls.maxDistance = 4;
    
    // Handle window resize
    window.addEventListener('resize', () => {
      const container = document.getElementById('planet-model-container');
      camera.aspect = container.offsetWidth / container.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    });
    
    // Control buttons functionality
    document.getElementById('rotate-left').addEventListener('click', () => {
      earth.rotation.y -= 0.5;
      clouds.rotation.y -= 0.5;
    });
    
    document.getElementById('rotate-right').addEventListener('click', () => {
      earth.rotation.y += 0.5;
      clouds.rotation.y += 0.5;
    });
    
    document.getElementById('zoom-in').addEventListener('click', () => {
      if (camera.position.z > 1.6) camera.position.z -= 0.3;
    });
    
    document.getElementById('zoom-out').addEventListener('click', () => {
      if (camera.position.z < 4) camera.position.z += 0.3;
    });
    
    document.getElementById('reset-view').addEventListener('click', () => {
      camera.position.set(0, 0, 2);
      earth.rotation.set(0, 0, 0);
      clouds.rotation.set(0, 0, 0);
    });
    
    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      
      // Slowly rotate Earth and clouds
      earth.rotation.y += 0.0005;
      clouds.rotation.y += 0.0007;
      
      controls.update();
      renderer.render(scene, camera);
    }
    
    animate();
  }
  