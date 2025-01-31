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
    document.body.appendChild(this.renderer.domElement);

    // Create particles array
    this.particles = [];
    this.particlesCount = 100;

    // Define colors
    this.colors = [
      0xff0000, // red
      0x00ff00, // green
      0x000000, // black
      0xffff00, // yellow
    ];

    // Create spherical particles
    for (let i = 0; i < this.particlesCount; i++) {
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      const size = Math.random() * 2 + 0.5; // Random size between 0.5 and 2.5

      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: color,
        shininess: 100,
        specular: 0x444444,
      });

      const mesh = new THREE.Mesh(geometry, material);

      // Random position
      mesh.position.x = (Math.random() - 0.5) * 50;
      mesh.position.y = (Math.random() - 0.5) * 50;
      mesh.position.z = (Math.random() - 0.5) * 50;

      // Random velocity
      mesh.velocity = {
        x: (Math.random() - 0.5) * 0.2,
        y: (Math.random() - 0.5) * 0.2,
        z: (Math.random() - 0.5) * 0.2,
      };

      this.particles.push(mesh);
      this.scene.add(mesh);
    }

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);

    // Position camera
    this.camera.position.z = 50;

    // Start animation
    this.animate();

    // Add window resize handler
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // Update particle positions
    this.particles.forEach((particle) => {
      particle.position.x += particle.velocity.x;
      particle.position.y += particle.velocity.y;
      particle.position.z += particle.velocity.z;

      // Wrap around if particles go too far
      if (Math.abs(particle.position.x) > 25) particle.position.x *= -0.9;
      if (Math.abs(particle.position.y) > 25) particle.position.y *= -0.9;
      if (Math.abs(particle.position.z) > 25) particle.position.z *= -0.9;
    });

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
