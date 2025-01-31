// Remove the import statement since we're using CDN
// import * as THREE from 'three';

class ParticleSystem {
  constructor() {
    // Set up scene, camera, and renderer
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xffffff);
    document.body.appendChild(this.renderer.domElement);

    // Create a group to hold all particles
    this.particleGroup = new THREE.Group();
    this.scene.add(this.particleGroup);

    // Particle tracking
    this.particles = [];
    this.maxParticles = 15;

    // Define neon colors
    this.colors = [
      0x00ffff, // neon blue
      0x39ff14, // neon green
      0xff6b00, // neon orange
      0xff69b4, // neon pink
    ];

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);

    // Position camera
    this.camera.position.z = 50;

    // Create initial center particle
    this.createCenterParticle();

    // Start the particle generation process
    this.scheduleNextParticle();

    // Start animation
    this.animate();

    // Add window resize handler
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  createCenterParticle() {
    const geometry = new THREE.SphereGeometry(3.0, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: this.getRandomColor(),
      shininess: 150,
      specular: 0x666666,
      emissive: this.getRandomColor(),
      emissiveIntensity: 0.5,
    });

    const centerParticle = new THREE.Mesh(geometry, material);
    centerParticle.position.set(0, 0, 0);
    this.particles.push(centerParticle);
    this.particleGroup.add(centerParticle);
  }

  createAttachedParticle() {
    if (this.particles.length >= this.maxParticles) return;

    const size = Math.random() * 2 + 1.5; // Random size between 1.5 and 3.5
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const color = this.getRandomColor();
    const material = new THREE.MeshPhongMaterial({
      color: color,
      shininess: 150,
      specular: 0x666666,
      emissive: color,
      emissiveIntensity: 0.5,
    });

    const particle = new THREE.Mesh(geometry, material);

    // Generate random spherical coordinates
    const phi = Math.random() * Math.PI * 2; // Random angle around Y axis
    const theta = Math.random() * Math.PI; // Random angle from Y axis
    const radius = 5; // Distance from center

    // Convert spherical coordinates to Cartesian
    particle.position.x = radius * Math.sin(theta) * Math.cos(phi);
    particle.position.y = radius * Math.sin(theta) * Math.sin(phi);
    particle.position.z = radius * Math.cos(theta);

    this.particles.push(particle);
    this.particleGroup.add(particle);

    // Schedule next particle if we haven't reached the maximum
    if (this.particles.length < this.maxParticles) {
      this.scheduleNextParticle();
    }
  }

  scheduleNextParticle() {
    const delay = Math.random() * 5000 + 1000; // Random delay between 1-6 seconds (1000-6000 milliseconds)
    setTimeout(() => this.createAttachedParticle(), delay);
  }

  getRandomColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // Rotate the entire particle group
    this.particleGroup.rotation.x += 0.005;
    this.particleGroup.rotation.y += 0.005;

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

// Initialize the particle system
const particleSystem = new ParticleSystem();
