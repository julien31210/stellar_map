
class Astre {
  constructor(args) {
    // { radius, color, type, mass, orbit }
    // DOC
    // orbit = {
    //   parent = orbital direct parent,
    //   distance = distance between parent and this astral object,
    // }

    Object.keys(args)
      .forEach((key) => {
        this[key] = args[key];
      });

    if (typeof this.preconstruct === 'function') this.preconstruct();

    this.init();
  }

  orbitAround(stellarParent) {
    const { sqrt, PI } = Math;
    if (stellarParent) {
      this.orbit.parent = stellarParent;
    }
    if (this.orbit.parent) {
      const { eccentricity, distance, tilt, aprox: aproxValues } = this.orbit;

      // calculate Orbit things
      this.orbit.eccentricity = aprox(eccentricity, aproxValues && aproxValues.eccentricity) || 0;
      this.orbit.distance = aprox(distance, aproxValues && aproxValues.distance) || 0;
      this.orbit.tilt = convert.radians(aprox(tilt, aproxValues && aproxValues.tilt) || 0);

      const orbitSpeed = sqrt(6.67 * (10 ** -11) * this.orbit.parent.mass / this.orbit.distance) / dimentionsDivider;
      const orbitPeriod = PI * 2 * this.orbit.distance / orbitSpeed;

      this.nominalRadiantSpeed = PI / orbitPeriod;
    }
  }

  init() {

    this.radialPosition = Math.PI;

    if (this.orbit && this.orbit.parent) {
      this.orbitAround(this.orbit.parent);
    }
    this.logMySelf();
    this.initThreeObj();
  }

  logMySelf() {
    console.log(this);
  }

  initThreeObj() {
    const { radius, color } = this;

    // make a sphere and put it in threeObj
    const geometry = new THREE.SphereGeometry(radius, (radius / 20) + 50, (radius / 20) + 50);
    const material = new THREE.MeshStandardMaterial({ color });
    this.threeObj = new THREE.Mesh(geometry, material);

    this.uuid = this.threeObj.uuid;
    scene.add(this.threeObj);
  }

  setBaseRadialPosition(rad) {
    this.radialPosition = rad;
  }

  animate(delta) {
    if (this.orbit && this.orbit.parent) {
      const { nominalRadiantSpeed, orbit: { parent, distance, eccentricity, tilt } } = this;
      const { cos, sin, PI, abs } = Math;

      const radialStep = nominalRadiantSpeed * delta;
      if (radialStep !== 0) this.radialPosition += radialStep;
      if (this.radialPosition > PI * 2) this.radialPosition -= PI * 2;

      this.threeObj.position.x = parent.threeObj.position.x + distance * eccentricity + cos(this.radialPosition) * (distance + distance * abs(eccentricity));
      this.threeObj.position.z = parent.threeObj.position.z + sin(this.radialPosition) * (distance - (distance * sin(tilt)));
      this.threeObj.position.y = parent.threeObj.position.y + sin(this.radialPosition) * distance * sin(tilt);
    }
    if (this.nestedAnimate && typeof this.nestedAnimate === 'function') this.nestedAnimate(delta);
  }
}
