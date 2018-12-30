
const createSollarSystem = () => {
  const sun = new Star({
    radius: 6.957 * (10 ** 6) / dimentionsDivider,
    color: 0xf0f00f,
    mass: (1.989 * (10 ** 30)) / dimentionsDivider,
    type: 'star'
  });
  univers.push(sun);

  const earth = new Astre({
    radius: 6.371 * (10 ** 3) / dimentionsDivider,
    color: 0x00ffff,
    type: 'planet',
    orbit: {
      parent: sun,
      distance: 1.49 * (10 ** 8) / dimentionsDivider,
      tilt: 30,
    },
    mass: 5.972 * (10 ** 24) / dimentionsDivider
  });
  univers.push(earth);

  const moon = new Astre({
    radius: 1.737 * (10 ** 3) / dimentionsDivider,
    color: 0xcccccc,
    type: 'planet',
    orbit: {
      parent: earth,
      distance: 3.84 * (10 ** 5) / dimentionsDivider,
      eccentricity: 10,
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
      nb: 1500,
      eccentricity: 10,
      tilt: 45,
      thickness: 1,
      aprox: {
        nb: 5,
        eccentricity: 20,
        tilt: 20,
        radius: 90,
        distance: 20,
      }
    }
  });
  univers.push(asteroidBelt);
};
