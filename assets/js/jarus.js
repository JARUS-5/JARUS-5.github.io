import * as THREE from "./three.module.js";

// Create loading screen
const loadingScreen = document.getElementById('loading-screen');

// COLORS
const COLORS = {
  silver: 0xF1F4FF,
  gray1: 0xA2A2A1,
  white: 0xFFFFFF,
  gray2: 0x202020,
  red: 0xFF4040,
  blue: 0x4040FF,
  green: 0x00C040
};

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.z = 10;

// Lighting
const ambientLight = new THREE.AmbientLight(COLORS.white, 0.4);
scene.add(ambientLight);

const light1 = new THREE.DirectionalLight(COLORS.white, 0.8);
light1.position.set(-1, 2, 5);
camera.add(light1);

const light2 = new THREE.PointLight(COLORS.white, 0.6);
light2.position.set(-1, 2, 5);
scene.add(light2);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(COLORS.gray2, 1);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Track active section
let activeSection = null;

// Mouse movement tracking
const mouse = {
  x: 0,
  y: 0,
  lastMoved: Date.now()
};

// Simple particles function that works reliably
function createParticles() {
  const particleCount = 1500;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount * 3; i += 3) {
    // Create a sphere distribution for stars
    const radius = 50;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i + 2] = radius * Math.cos(phi);
  }
  
  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 0.2,
    transparent: true,
    opacity: 0.8
  });
  
  const particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);
  
  return particleSystem;
}

const particles = createParticles();

// Handle section activation
function activateSection(sectionId, buttonId) {
  // Reset buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Activate clicked button
  document.getElementById(buttonId).classList.add('active');
  
  // Hide all content sections
  document.querySelectorAll('.section-content').forEach(el => {
    el.classList.remove('active');
  });
  
  // Show content immediately
  document.getElementById(sectionId).classList.add('active');
  
  // Store active section
  if (sectionId === 'about-content') {
    activeSection = 'about';
  } else if (sectionId === 'work-content') {
    activeSection = 'work';
  } else if (sectionId === 'contact-content') {
    activeSection = 'contact';
  }
}

// Event listeners for navigation buttons
document.getElementById('about-btn').addEventListener('click', () => {
  activateSection('about-content', 'about-btn');
});

document.getElementById('work-btn').addEventListener('click', () => {
  activateSection('work-content', 'work-btn');
});

document.getElementById('contact-btn').addEventListener('click', () => {
  activateSection('contact-content', 'contact-btn');
});

// Mouse move event listener
document.addEventListener('mousemove', (event) => {
  // Update mouse position (normalized from -1 to 1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
  
  // Update last moved timestamp
  mouse.lastMoved = Date.now();
  
  // Update cursor position
  cursor.style.left = event.clientX + 'px';
  cursor.style.top = event.clientY + 'px';
  
  // Follower has slight delay for nice effect
  setTimeout(() => {
    cursorFollower.style.left = event.clientX + 'px';
    cursorFollower.style.top = event.clientY + 'px';
  }, 50);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  const currentTime = Date.now();
  const timeSinceLastMove = currentTime - mouse.lastMoved;
  
  // If mouse has moved in the last 2 seconds, respond to mouse position
  if (timeSinceLastMove < 2000) {
    // Calculate target rotation based on mouse position
    const targetRotationX = mouse.y * 0.5;
    const targetRotationY = mouse.x * 0.5;
    
    // Smoothly interpolate current rotation to target rotation
    particles.rotation.x += (targetRotationX - particles.rotation.x) * 0.05;
    particles.rotation.y += (targetRotationY - particles.rotation.y) * 0.05;
    
    // Add slight parallax effect by moving particles based on mouse position
    particles.position.x += (mouse.x * 0.5 - particles.position.x) * 0.02;
    particles.position.y += (mouse.y * 0.5 - particles.position.y) * 0.02;
  } else {
    // Resume automatic rotation after 2 seconds of inactivity
    particles.rotation.y += 0.0005;
    
    // Gentle wave motion
    particles.rotation.x = Math.sin(currentTime * 0.0003) * 0.1;
    
    // Reset position slowly to center
    particles.position.x *= 0.98;
    particles.position.y *= 0.98;
  }
  
  renderer.render(scene, camera);
}

// Custom cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

// Change cursor style on interactive elements
document.querySelectorAll('button, a').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '15px';
    cursor.style.height = '15px';
    cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    cursorFollower.style.width = '40px';
    cursorFollower.style.height = '40px';
    cursorFollower.style.borderColor = 'rgba(255, 255, 255, 0.5)';
  });
  
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '10px';
    cursor.style.height = '10px';
    cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    cursorFollower.style.width = '30px';
    cursorFollower.style.height = '30px';
    cursorFollower.style.borderColor = 'rgba(255, 255, 255, 0.3)';
  });
});

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Hide loading screen after everything is loaded
window.addEventListener('load', () => {
  setTimeout(() => {
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
      loadingScreen.remove();
    }, 500);
  }, 1000);
});

// Handle touch devices
if ('ontouchstart' in window) {
  document.querySelector('.cursor').style.display = 'none';
  document.querySelector('.cursor-follower').style.display = 'none';
  
  // Use touch events to update mouse position for particle movement
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      mouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.touches[0].clientY / window.innerHeight) * 2 - 1);
      mouse.lastMoved = Date.now();
    }
  });
}

// Start animation
animate();
