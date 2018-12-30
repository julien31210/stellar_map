
class AsteroiBelt extends Astre {
  constructor({ radius, color, type, mass, orbit }) {
    super({ radius, color, type, mass, orbit });
  }

  initThreeObj() {
    const { radius, color } = this;
    const { nb, eccentricity, tilt, distance, aprox: aproxValues } = this.orbitObj;

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
    this.orbitObj.asteroids = asteroids;
    this.orbitObj.eccentricity = aprox(eccentricity, aproxValues && aproxValues.eccentricity) / 100;

    this.threeObj.rotateX(tilt || 0);
    this.uuid = this.threeObj.uuid;

    scene.add(this.threeObj);
  }

  animate(delta) {
    const { nominalRadiantSpeed, orbitObj: { parent, eccentricity, asteroids, thickness } } = this;
    const { cos, sin, PI } = Math;
    const radialStep = nominalRadiantSpeed * delta;

    if (radialStep !== 0) this.radialPosition += radialStep;
    if (this.radialPosition > PI * 100) this.radialPosition -= PI * 100;


    asteroids.forEach((astero) => {
      const { threeObj, radialPosition, radialPositionY, d } = astero;
      const rad = this.radialPosition + radialPosition;

      threeObj.position.x = parent.threeObj.position.x + d * eccentricity + cos(rad) * (d + d * eccentricity);
      threeObj.position.z = parent.threeObj.position.z + sin(rad) * (d);
      threeObj.position.y = parent.threeObj.position.y + sin(radialPositionY) * (d * ((thickness || 0) / 100));
    });

  }
}
