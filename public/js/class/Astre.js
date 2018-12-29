
class Astre {
  constructor({ radius, color, type, mass, orbit }) {
    // DOC
    // orbit = {
    //   parent = orbital direct parent,
    //   distance = distance between parent and this astral object,
    // }

    this.mass = mass;
    this.type = type;
    this.radius = radius;
    this.color = color;
    this.orbitObj = orbit;

    this.init();

  }

  init() {

    if (this.orbitObj && this.orbitObj.parent && this.orbitObj.parent.mass && this.orbitObj.distance) {
      const { sqrt, PI } = Math;

      const orbitSpeed = sqrt(6.67 * (10 ** -11) * this.orbitObj.parent.mass / this.orbitObj.distance) / dimentionsDivider;
      const orbitPeriod = PI * 2 * this.orbitObj.distance / orbitSpeed;

      this.radialPosition = PI;
      this.nominalRadiantSpeed = PI / orbitPeriod;
    }

    // this.logMySelf();
    this.initThreeObj();
  }

  logMySelf() {
    console.log(this);
  }

  initThreeObj() {
    const { radius, color } = this;
    if (this.type === 'star') {
      this.threeObj = sunlight(color, 2, 10000000, radius);
    } else {
      const { eccentricity, distance, tilt, aprox: aproxValues } = this.orbitObj;
      this.threeObj = sphere(radius, color);

      this.orbitObj.eccentricity = (aprox(eccentricity, aproxValues && aproxValues.eccentricity) / 100) || 0;
      this.orbitObj.distance = aprox(distance, aproxValues && aproxValues.distance) || 0;
      this.orbitObj.tilt = aprox(tilt, aproxValues && aproxValues.tilt) || 0;
    }
    this.uuid = this.threeObj.uuid;
    scene.add(this.threeObj);
  }

  orbit(stellarParent) {
    this.orbitObj.parent = stellarParent;
  }

  animate(delta) {
    if (this.orbitObj && this.orbitObj.parent) {
      const { nominalRadiantSpeed, orbitObj: { parent, distance, eccentricity, tilt } } = this;
      const { cos, sin, PI } = Math;

      const radialStep = nominalRadiantSpeed * delta;
      if (radialStep !== 0) this.radialPosition += radialStep;
      if (this.radialPosition > PI * 100) this.radialPosition -= PI * 100;

      this.threeObj.position.x = parent.threeObj.position.x + distance * eccentricity + cos(this.radialPosition) * (distance + distance * eccentricity);
      this.threeObj.position.z = parent.threeObj.position.z + sin(this.radialPosition) * distance;
      this.threeObj.position.y = parent.threeObj.position.y + sin(this.radialPosition) * distance * (tilt / 100);
    }
  }
}

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
