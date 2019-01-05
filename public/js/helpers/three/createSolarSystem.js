
const createSollarSystem = () => {
  const sun = new Star({
    name: 'sun',
    radius: 3.957 * (10 ** 6) / dimentionsDivider,
    color: 0xf0f00f,
    mass: (1.989 * (10 ** 30)) / dimentionsDivider,
    type: 'star',
    orbit: {
      eccentricity: .4,
      tilt: 45,
      distance: (15 * (10 ** 6)) / dimentionsDivider,
    }
  });
  univers.push(sun);
  const sun2 = new Star({
    name: 'sun2',
    radius: 3.957 * (10 ** 6) / dimentionsDivider,
    color: 0xf0f00f,
    mass: (1.989 * (10 ** 30)) / dimentionsDivider,
    type: 'star',
    orbit: {
      eccentricity: -.4,
      tilt: 45,
      distance: (15 * (10 ** 6)) / dimentionsDivider,
    }
  });
  univers.push(sun2);

  const binaryStars = new BinaryStars({
    name: 'binaryStars',
    type: 'binary stars',
    star1: sun,
    star2: sun2,
    tilt: 0,
    orbit: {}
  });
  univers.push(binaryStars);

  const earth = new Astre({
    name: 'earth',
    radius: 6.371 * (10 ** 3) / dimentionsDivider,
    color: 0x00ffff,
    type: 'planet',
    orbit: {
      parent: binaryStars,
      distance: 1.49 * (10 ** 8) / dimentionsDivider,
      tilt: 0,
    },
    mass: 5.972 * (10 ** 24) / dimentionsDivider
  });
  univers.push(earth);

  const moon = new Astre({
    name: 'moon',
    radius: 1.737 * (10 ** 3) / dimentionsDivider,
    color: 0xcccccc,
    type: 'planet',
    orbit: {
      parent: earth,
      distance: 3.84 * (10 ** 5) / dimentionsDivider,
      eccentricity: .1,
      tilt: .0514,
    },
    mass: (7.36 * (10 ** 22)) / dimentionsDivider
  });
  univers.push(moon);

  // const asteroidBelt = new AsteroiBelt({
  //   name: 'asteroidBelt',
  //   radius: 30000 / dimentionsDivider,
  //   color: 0xcccccc,
  //   type: 'asteroid belt',
  //   orbit: {
  //     parent: sun,
  //     distance: (7.5 * (10 ** 6)) / dimentionsDivider,
  //     // distance: (1.75 * (10 ** 7)) / dimentionsDivider,
  //     nb: 1000,
  //     eccentricity: .1,
  //     tilt: 90,
  //     thickness: 5,
  //     aprox: {
  //       nb: 5,
  //       eccentricity: 20,
  //       tilt: 20,
  //       radius: 0,
  //       distance: 20,
  //     }
  //   }
  // });
  // univers.push(asteroidBelt);
};
