

const sphere = (radius, color, type) => {
  const geometry = new THREE.SphereGeometry(radius + 2, (radius / 20) + 50, (radius / 20) + 50);
  let material;
  if (type === 'basic') {
    material = new THREE.MeshBasicMaterial({
      color,
    });
  } else {
    material = new THREE.MeshStandardMaterial({
      color,
    });
  }

  return new THREE.Mesh(geometry, material);
};

const asteroiBelt = ({ nb, distance, color, radius, eccentricity }) => {

  const beltCenter = new THREE.Object3D();
  const asteroids = [];

  const material = new THREE.MeshBasicMaterial({
    color,
    // wireframe: true
  });

  const aproxEccentricity = aprox(eccentricity, 2);

  for (let i = 0; i < nb; i += 1) {
    const r = aprox(radius, 1.1);
    const geometry = new THREE.SphereGeometry(r, 5, 5);

    const astero = new THREE.Mesh(geometry, material);

    const radialPosition = radiantRand();
    const radialPositionY = radiantRand();

    const d = aprox(distance, 20);

    asteroids.push({ threeObj: astero, radialPosition, radialPositionY, d });
    beltCenter.add(astero);
  }
  return { beltCenter, asteroids, eccentricity: aproxEccentricity };
};

const dimentionsDivider = 10000;

const sunlight = (color, intensity, scope, radius) => {

  const sollar = sphere(radius, color, 'basic');
  const light = new THREE.PointLight(color, intensity, scope);

  return light.add(sollar);
};

const createSollarSystem = (size) => { // eslint-disable-line
  const sun = new Astre({
    radius: (69.57 * (10 ** 5)) / dimentionsDivider,
    color: 0xf0f00f,
    mass: (1.989 * (10 ** 30)) / dimentionsDivider,
    type: 'star'
  });
  univers.push(sun);

  const earth = new Astre({
    radius: 6371 / dimentionsDivider, // 10 times biger for perception
    color: 0x00ffff,
    type: 'planet',
    orbit: {
      parent: sun,
      distance: (149 * (10 ** 6)) / dimentionsDivider,
    },
    mass: (5.972 * (10 ** 24)) / dimentionsDivider
  });
  univers.push(earth);

  const moon = new Astre({
    radius: 1737 / dimentionsDivider, // 10 times biger for perception
    color: 0xcccccc,
    type: 'planet',
    orbit: {
      parent: earth,
      distance: (384 * (10 ** 3)) / dimentionsDivider,
    },
    mass: (7.36 * (10 ** 22)) / dimentionsDivider
  });
  univers.push(moon);

  const asteroidBelt = new AsteroiBelt({
    radius: 30000 / dimentionsDivider,
    color: 0xcccccc,
    type: 'asteroid belt',
    orbit: {
      parent: sun,
      distance: (175 * (10 ** 5)) / dimentionsDivider,
      nb: 1500
    }
  });
  univers.push(asteroidBelt);
};
