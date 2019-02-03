
const createSollarSystem = (parent) => {
  const sun = new Star({
    name: 'sun',
    radius: convert.to(695508), // 6.95 508
    color: 0xf0f00f,
    mass: ((1.989 / 2) * (10 ** 30)),
    type: 'star',
    orbit: {
      eccentricity: .4,
      tilt: 90,
      distance: convert.to('3M'),
    }
  });
  univers.push(sun);
  const sun2 = new Star({
    name: 'sun2',
    radius: convert.to(695508),
    color: 0xf0f00f,
    mass: ((1.989 / 2) * (10 ** 30)),
    type: 'star',
    orbit: {
      eccentricity: -.4,
      tilt: 90,
      distance: convert.to('3M'),
    }
  });
  univers.push(sun2);

  const binaryStars = new BinaryStars({
    name: 'binaryStars',
    type: 'binary stars',
    star1: sun,
    star2: sun2,
    tilt: 0,
    orbit: { parent }
  });
  univers.push(binaryStars);

  const earth = new Astre({
    name: 'earth',
    radius: convert.to(6371),
    color: 0x00ffff,
    type: 'planet',
    orbit: {
      parent: binaryStars,
      distance: convert.to('149,6 M'),
      tilt: 0,
    },
    mass: 5.972 * (10 ** 24)
  });
  univers.push(earth);

  const moon = new Astre({
    name: 'moon',
    radius: convert.to(3474),
    color: 0xcccccc,
    type: 'planet',
    orbit: {
      parent: earth,
      distance: convert.to(384000),
      eccentricity: .1,
      tilt: 5.14,
    },
    mass: (7.36 * (10 ** 22))
  });
  univers.push(moon);

  // const asteroidBelt = new AsteroiBelt({
  //   name: 'asteroidBelt',
  //   radius: 30000,
  //   color: 0xcccccc,
  //   type: 'asteroid belt',
  //   orbit: {
  //     parent: sun,
  //     distance: (7.5 * (10 ** 6)),
  //     // distance: (1.75 * (10 ** 7)),
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
