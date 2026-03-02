// Base path configuration - deployed at /space/
const BASE_PATH = '/space/';

// Authentication check
function checkAuth() {
  const authCookie = document.cookie.includes('portal_auth');
  if (!authCookie) {
    // Redirect to login page if not authenticated
    window.location.href = '/login.html';
    return false;
  }
  return true;
}

// Format numbers with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Format distance in astronomical units or km
function formatDistance(km) {
  const au = km / 149600000; // 1 AU in km
  if (au < 1) {
    return formatNumber(Math.round(km / 1000)) + ' 万公里';
  }
  return au.toFixed(2) + ' AU';
}

// Format orbital period
function formatOrbitalPeriod(days) {
  if (days >= 365) {
    const years = (days / 365).toFixed(1);
    return years + ' 年';
  }
  return days + ' 天';
}

// Calculate orbit duration based on Kepler's Third Law
// T² ∝ a³, so T ∝ a^(3/2), where a is the orbital radius
// Angular velocity ω ∝ a^(-3/2)
function calculateOrbitDuration(orbitRadius) {
  // Base duration for Earth (orbitRadius = 100)
  const earthDuration = 20; // seconds for one orbit
  const earthRadius = 100;
  
  // Kepler's Third Law: T ∝ a^(3/2)
  // T is orbital period, a is semi-major axis (orbital radius)
  const keplerExponent = 1.5;
  
  // Calculate duration based on orbital radius
  const duration = earthDuration * Math.pow(orbitRadius / earthRadius, keplerExponent);
  
  // Clamp to reasonable bounds (min 3s for Mercury, max 90s for Neptune)
  return Math.max(3, Math.min(90, duration));
}

// Create planet element
function createPlanet(planet, index) {
  const solarSystem = document.querySelector('.solar-system');

  // Create orbit
  const orbit = document.createElement('div');
  orbit.className = 'orbit';
  const orbitSize = planet.orbitRadius * 2;
  orbit.style.width = `${orbitSize}px`;
  orbit.style.height = `${orbitSize}px`;
  orbit.style.animationDuration = `${calculateOrbitDuration(planet.orbitRadius)}s`;

  // Create planet container for counter-rotation
  const planetContainer = document.createElement('div');
  planetContainer.className = 'planet-container';
  planetContainer.style.animationDuration = `${calculateOrbitDuration(planet.orbitRadius)}s`;

  // Position planet on orbit
  const planetEl = document.createElement('div');
  planetEl.className = `planet planet-${planet.size}`;
  planetEl.style.background = `radial-gradient(circle at 30% 30%, ${planet.color}, ${adjustColor(planet.color, -30)})`;
  planetEl.style.color = planet.color; // For hover shadow
  planetEl.dataset.planet = planet.nameEn;

  // Add Saturn's rings
  if (planet.nameEn === 'Saturn') {
    const ring = document.createElement('div');
    ring.className = 'saturn-ring';
    planetEl.appendChild(ring);
  }

  // Position planet on the orbit edge
  planetEl.style.left = `${planet.orbitRadius}px`;
  planetEl.style.top = '50%';
  planetEl.style.transform = 'translate(-50%, -50%)';

  planetContainer.appendChild(planetEl);
  orbit.appendChild(planetContainer);
  solarSystem.appendChild(orbit);

  // Add click event for planet info
  planetEl.addEventListener('click', (e) => {
    e.stopPropagation();
    showPlanetInfo(planet);
  });
}

// Adjust color brightness
function adjustColor(color, amount) {
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

// Show planet information modal
function showPlanetInfo(planet) {
  const modal = document.getElementById('planetModal');
  const nameEl = document.getElementById('planetName');
  const nameEnEl = document.getElementById('planetNameEn');
  const radiusEl = document.getElementById('planetRadius');
  const distanceEl = document.getElementById('planetDistance');
  const periodEl = document.getElementById('planetOrbitalPeriod');
  const descriptionEl = document.getElementById('planetDescription');

  nameEl.textContent = planet.name;
  nameEnEl.textContent = planet.nameEn;
  radiusEl.textContent = formatNumber(planet.radius) + ' km';
  distanceEl.textContent = formatDistance(planet.distanceFromSun);
  periodEl.textContent = formatOrbitalPeriod(planet.orbitalPeriod);
  descriptionEl.textContent = planet.description;

  modal.classList.add('active');
}

// Close modal
function closeModal() {
  const modal = document.getElementById('planetModal');
  modal.classList.remove('active');
}

// Show sun information
function showSunInfo() {
  const sunData = {
    name: '太阳',
    nameEn: 'Sun',
    radius: 696340,
    distanceFromSun: 0,
    orbitalPeriod: 0,
    description: '太阳系中心的恒星，为整个星系提供光和热。它的质量占整个太阳系的99.86%。表面温度约5500°C，核心温度高达1500万°C。'
  };

  const modal = document.getElementById('planetModal');
  const nameEl = document.getElementById('planetName');
  const nameEnEl = document.getElementById('planetNameEn');
  const radiusEl = document.getElementById('planetRadius');
  const distanceEl = document.getElementById('planetDistance');
  const periodEl = document.getElementById('planetOrbitalPeriod');
  const descriptionEl = document.getElementById('planetDescription');

  nameEl.textContent = sunData.name;
  nameEnEl.textContent = sunData.nameEn;
  radiusEl.textContent = formatNumber(sunData.radius) + ' km';
  distanceEl.textContent = 'N/A (中心)';
  periodEl.textContent = 'N/A (自转约25天)';
  descriptionEl.textContent = sunData.description;

  modal.classList.add('active');
}

// Load planet data and initialize
async function init() {
  // Check authentication first
  if (!checkAuth()) {
    return;
  }

  try {
    // Load planet data with base path support
    const dataPath = `${BASE_PATH}data/planets.json`;
    const response = await fetch(dataPath);

    if (!response.ok) {
      throw new Error(`Failed to load planet data: ${response.status}`);
    }

    const data = await response.json();

    // Create planets
    data.planets.forEach((planet, index) => {
      createPlanet(planet, index);
    });

    // Add click handler for sun
    document.querySelector('.sun').addEventListener('click', showSunInfo);

    // Add modal close handlers
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('planetModal').addEventListener('click', (e) => {
      if (e.target.id === 'planetModal') {
        closeModal();
      }
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });

  } catch (error) {
    console.error('Failed to initialize:', error);
    // Show error in the page
    document.querySelector('.universe').innerHTML = `
      <div style="text-align: center; padding: 40px; color: #ff6b6b;">
        <h2>加载失败</h2>
        <p>无法加载行星数据: ${error.message}</p>
        <p style="margin-top: 20px; font-size: 14px; color: #888;">
          请确保已登录并刷新页面
        </p>
      </div>
    `;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}