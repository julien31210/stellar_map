

const sphere = (radius, color) => {
  const geometry = new THREE.SphereGeometry(radius + 20, (radius / 20) + 50, (radius / 20) + 50);
  const material = new THREE.MeshBasicMaterial({
    color,
    // wireframe: true
  });
  return new THREE.Mesh(geometry, material);
};

const dimentionsDivider = 10000;

const createSollarSystem = (size) => { // eslint-disable-line
  const sun = new Astre({ radius: (69.57 * (10 ** 5)) / dimentionsDivider, color: 0xf0f00f, mass: (1.989 * (10 ** 30)) / dimentionsDivider, type: 'star' });
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

};
