
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

      const orbitSpeed = (Math.sqrt(6.67 * (10 ** -11) * this.orbitObj.parent.mass / this.orbitObj.distance)) / dimentionsDivider;
      const orbitPeriod = Math.PI * 2 * this.orbitObj.distance / orbitSpeed;
      console.log('orbitSpeed', orbitSpeed);
      console.log('orbitPeriod', orbitPeriod);

      this.radialPosition = Math.PI;
      this.nominalRadiantSpeed = ((2 * Math.PI - Math.PI) / orbitPeriod);
    }

    // this.logMySelf();
    this.initThreeObj();
  }

  logMySelf() {
    console.log(this);
  }

  initThreeObj() {
    const { radius, color } = this;
    this.threeObj = sphere(radius, color);
    this.uuid = this.threeObj.uuid;
    scene.add(this.threeObj);
  }

  orbit(stellarParent) {
    this.orbitObj.parent = stellarParent;
  }

  animate(delta) {
    if (this.orbitObj && this.orbitObj.parent) {
      const { nominalRadiantSpeed, orbitObj: { parent, distance } } = this;
      const radialStep = nominalRadiantSpeed * delta;
      if (delta !== 0) this.radialPosition += radialStep;
      if (this.radialPosition > Math.PI * 100) {
        this.radialPosition -= Math.PI * 100;
      }

      this.threeObj.position.x = parent.threeObj.position.x + Math.cos(this.radialPosition) * distance;
      this.threeObj.position.z = parent.threeObj.position.z + Math.sin(this.radialPosition) * distance;
      this.threeObj.position.y = parent.threeObj.position.y + Math.sin(this.radialPosition) * 0;
    }
  }
}

class AsteroiBelt extends Astre {
  constructor({ radius, color, type, mass, orbit }) {
    super({ radius, color, type, mass, orbit });
  }

  initThreeObj() {
    const { radius, color } = this;
    const { beltCenter, asteroids, eccentricity } = asteroiBelt({ nb: this.orbitObj.nb, distance: this.orbitObj.distance, color, radius, eccentricity: 2000 });

    this.threeObj = beltCenter;
    this.orbitObj.asteroids = asteroids;
    this.orbitObj.eccentricity = eccentricity;
    this.orbitObj.tilt = 90;
    this.orbitObj.radius = radius;
    this.uuid = this.threeObj.uuid;

    scene.add(this.threeObj);
  }

  animate(delta) {
    const { nominalRadiantSpeed, orbitObj: { parent, apo, contrapo, eccentricity, tilt } } = this;
    const radialStep = nominalRadiantSpeed * delta;

    if (delta !== 0) this.radialPosition += radialStep;
    if (this.radialPosition > Math.PI * 100) {
      this.radialPosition -= Math.PI * 100;
    }

    const { cos, sin } = Math;
    const { asteroids } = this.orbitObj;

    asteroids.forEach((astero) => {
      const { threeObj, radialPosition, radialPositionY, d } = astero;
      const rad = this.radialPosition + radialPosition;

      threeObj.position.x = parent.threeObj.position.x + eccentricity + cos(rad) * (d + eccentricity);
      threeObj.position.z = parent.threeObj.position.z + sin(rad) * d;
      threeObj.position.y = parent.threeObj.position.y + sin(radialPositionY) * (d / 50);
      // + cos(rad) * (d) + d / 2;
      this.test = cos(rad) * d;
    });

  }
}
