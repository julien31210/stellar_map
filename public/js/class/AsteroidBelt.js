
class AsteroiBelt extends Astre {

  initThreeObj() {
    const { radius, color } = this;
    const { nb, eccentricity, tilt, distance, aprox: aproxValues, thickness } = this.orbit;

    const beltCenter = new THREE.Object3D();
    const asteroids = [];

    const material = new THREE.MeshStandardMaterial({ color });

    for (let i = 0; i < aprox(nb, aproxValues && aproxValues.nb); i += 1) {
      const r = aprox(radius, aproxValues && aproxValues.radius);
      const geometry = new THREE.SphereGeometry(r, 5, 5);

      const astero = new THREE.Mesh(geometry, material);

      const radialPosition = radiantRand();
      const radialPositionY = radiantRand();

      const d = aprox(distance, aproxValues && aproxValues.distance);

      asteroids.push({ threeObj: astero, radialPosition, radialPositionY, d });
      beltCenter.add(astero);
    }

    this.threeObj = beltCenter;
    this.orbit.asteroids = asteroids;
    this.orbit.eccentricity = aprox(eccentricity, aproxValues && aproxValues.eccentricity);
    this.orbit.tilt = convert.radians(tilt || 0);
    this.orbit.thickness = convert.radians(thickness || 0);

    this.uuid = this.threeObj.uuid;

    scene.add(this.threeObj);
  }

  animate(delta) {
    const { nominalRadiantSpeed, orbit: { parent, eccentricity, asteroids, thickness, tilt } } = this;
    const { cos, sin, PI } = Math;
    const radialStep = nominalRadiantSpeed * delta;

    if (radialStep !== 0) this.radialPosition += radialStep;
    if (this.radialPosition > PI * 2) this.radialPosition -= (2 * PI) * (this.radialPosition % (2 * PI));


    asteroids.forEach((astero) => {
      const { threeObj, radialPosition, radialPositionY, d } = astero;
      const rad = this.radialPosition + radialPosition;

      threeObj.position.x = parent.threeObj.position.x + d * eccentricity + cos(rad) * (d + d * eccentricity);
      threeObj.position.z = parent.threeObj.position.z + sin(rad) * (d - d * sin(tilt)) + sin(radialPositionY) * d * sin(tilt) * sin(thickness);
      threeObj.position.y = parent.threeObj.position.y + sin(rad) * d * sin(tilt) + sin(radialPositionY) * d * cos(tilt) * sin(thickness);
    });

  }
}
