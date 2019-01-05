
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
    const { eccentricity, distance, tilt, aprox: aproxValues } = this.orbitObj;

    // make a sphere and put it in threeObj
    const geometry = new THREE.SphereGeometry(radius, (radius / 20) + 50, (radius / 20) + 50);
    const material = new THREE.MeshStandardMaterial({
      color,
    });
    this.threeObj = new THREE.Mesh(geometry, material);

    // calculate Orbit things
    this.orbitObj.eccentricity = (aprox(eccentricity, aproxValues && aproxValues.eccentricity) / 100) || 0;
    this.orbitObj.distance = aprox(distance, aproxValues && aproxValues.distance) || 0;
    this.orbitObj.tilt = aprox(tilt, aproxValues && aproxValues.tilt) || 0;

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
