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

    // Define new neon colors
    this.colors = [
      0x00ffff, // neon blue
      0x39ff14, // neon green
      0xff6b00, // neon orange
      0xff69b4, // neon pink
    ];

    // Create spherical particles
    for (let i = 0; i < this.particlesCount; i++) {
      // Get random color from the neon colors array
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      const size = Math.random() * 2 + 0.5;

      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: color,
        shininess: 150, // Increased shininess for more neon effect
        specular: 0x666666, // Adjusted specular for better glow
        emissive: color, // Make the color emit light
        emissiveIntensity: 0.5, // Control the strength of the emission
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

    // Adjust lighting for neon effect
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
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
