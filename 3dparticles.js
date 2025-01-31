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
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Create particles
    this.particlesGeometry = new THREE.BufferGeometry();
    this.particlesCount = 1000;

    // Create arrays for particle positions and velocities
    this.positions = new Float32Array(this.particlesCount * 3);
    this.velocities = [];

    // Initialize particles with random positions and velocities
    for (let i = 0; i < this.particlesCount * 3; i += 3) {
      // Random positions within -50 to 50 range
      this.positions[i] = (Math.random() - 0.5) * 100;
      this.positions[i + 1] = (Math.random() - 0.5) * 100;
      this.positions[i + 2] = (Math.random() - 0.5) * 100;

      // Random velocities
      this.velocities.push({
        x: (Math.random() - 0.5) * 0.2,
        y: (Math.random() - 0.5) * 0.2,
        z: (Math.random() - 0.5) * 0.2,
      });
    }

    // Add positions to geometry
    this.particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.positions, 3)
    );

    // Create particle material
    this.particlesMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.8,
    });

    // Create particle system
    this.particles = new THREE.Points(
      this.particlesGeometry,
      this.particlesMaterial
    );
    this.scene.add(this.particles);

    // Position camera
    this.camera.position.z = 100;

    // Start animation
    this.animate();

    // Add window resize handler
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // Update particle positions
    for (let i = 0; i < this.particlesCount * 3; i += 3) {
      this.positions[i] += this.velocities[i / 3].x;
      this.positions[i + 1] += this.velocities[i / 3].y;
      this.positions[i + 2] += this.velocities[i / 3].z;

      // Wrap particles around if they go too far
      if (Math.abs(this.positions[i]) > 50) this.positions[i] *= -0.9;
      if (Math.abs(this.positions[i + 1]) > 50) this.positions[i + 1] *= -0.9;
      if (Math.abs(this.positions[i + 2]) > 50) this.positions[i + 2] *= -0.9;
    }

    // Update geometry
    this.particlesGeometry.attributes.position.needsUpdate = true;

    // Rotate particle system
    this.particles.rotation.x += 0.001;
    this.particles.rotation.y += 0.001;

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
