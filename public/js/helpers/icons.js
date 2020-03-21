

const easyFindIconSize = .6;

const newCircle = (radius, quality) => {
  const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  const geometry = new THREE.Geometry();
  const r = radius || .25;
  const circleQuality = quality || 4;
  const tilt = Math.PI * .25; // 45 deg

  for (let i = 0; i <= circleQuality; i += 1) {
    const radPos = i * (Math.PI * 2 / circleQuality) + tilt;
    const x = r * Math.sin(radPos);
    const y = r * Math.cos(radPos);

    geometry.vertices.push(new THREE.Vector3(x, y, 0));
  }
  return new THREE.Line(geometry, material);
};

const newPoint = () => {
  const geo = new THREE.Geometry();
  const mat = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  geo.vertices.push(new THREE.Vector3(0, 0, 0));
  return new THREE.Points(geo, mat);
};

const icons = {
  Planet: () => newCircle(easyFindIconSize, 6),
  System: false, // no icons for systems
  BinaryStars: (binaryStars) => {
    const iconSize = easyFindIconSize * 1.5;
    const totalIconDistance = iconSize + .1;
    const totalVertices = 12;
    // Get real stars radius
    const realR1 = binaryStars.star1.radius;
    const realR2 = binaryStars.star2.radius;
    // Get real stars orbits distances
    const realDist1 = binaryStars.star1.orbit.distance;
    const realDist2 = binaryStars.star2.orbit.distance;
    // Totals
    const totalRealRadius = realR1 + realR2;
    const totalRealDistance = realDist1 + realDist2;

    // Icon stars radius
    const iconR1 = realR1 * iconSize / totalRealRadius;
    const iconR2 = realR2 * iconSize / totalRealRadius;

    // Icon stars distances from the middle of the icon
    const iconDist1 = realDist2 * totalIconDistance / totalRealDistance;
    const iconDist2 = realDist1 * totalIconDistance / totalRealDistance;

    // Icon stars distances from the middle of the icon (+ 2 to avoid to be at less than 3)
    const verticesNumber1 = Math.ceil(totalVertices * iconR1) + 2;
    const verticesNumber2 = Math.ceil(totalVertices * iconR2) + 2;

    const star1 = newCircle(iconR1, verticesNumber1);
    const star2 = newCircle(iconR2, verticesNumber2);

    star1.position.set(-iconDist1, 0, 0);
    star2.position.set(iconDist2, 0, 0);

    const bs = new THREE.Object3D();

    bs.add(star1, star2);

    return bs;
  }, // TO DO: use binary stars infos
  Galaxy: (galaxy) => {
    const iconSize = easyFindIconSize * 4;
    const { branchesNumber } = galaxy;
    // create icon taking into account its number of branches
    const sysNumberPerBranche = 10;

    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const geometry = new THREE.Geometry();

    const lines = [];
    for (let j = 0; j < branchesNumber; j += 1) {
      const lineGeometry = new THREE.Geometry();

      for (let i = 0; i <= sysNumberPerBranche - 1; i += 1) {
        // Define radial position of the vertice
        const radPos = ((Math.PI * 2) / sysNumberPerBranche / branchesNumber)
          * (sysNumberPerBranche - i)
          + (Math.PI * 2 / branchesNumber)
          * j;

        const r = (iconSize / sysNumberPerBranche) * i // Define distance between sys
          + iconSize / 10; // Define distance between galactic center and sys

        // Position the vertices of the lines
        const linex = r * Math.sin(radPos);
        const liney = r * Math.cos(radPos);
        // Position the points with radial offset
        const pointx = r * Math.sin(radPos + Math.PI / branchesNumber / 5);
        const pointy = r * Math.cos(radPos + Math.PI / branchesNumber / 5);

        // Push the vertices
        geometry.vertices.push(new THREE.Vector3(pointx, pointy, 0));
        lineGeometry.vertices.push(new THREE.Vector3(linex, liney, 0));
      }
      lines.push(new THREE.Line(lineGeometry, material));
    }
    const points = new THREE.Points(geometry, material);

    const g = new THREE.Object3D();

    g.add(
      points,
      ...lines
    );

    // g.children[0].material.color.set(0x00f9ff); // To set color
    return g;
  },
  Star: () => newCircle(easyFindIconSize * 1.2, 8)
};
