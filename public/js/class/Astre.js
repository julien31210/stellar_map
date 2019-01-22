
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
    this.childs = [];
    this.radialPosition = Math.PI;

    if (typeof this.preconstruct === 'function') this.preconstruct();

    this.init();
  }

  orbitAround(stellarParent) {
    const { sqrt, PI } = Math;
    if (stellarParent) this.orbit.parent = stellarParent;

    const f = this.orbit.parent.childs.filter(el => el.uuid === this.uuid);
    if (!f.length) this.orbit.parent.childs.push(this);
    if (this.orbit.parent) {
      const { eccentricity, distance, tilt, aprox: aproxValues } = this.orbit;

      // calculate Orbit things
      this.orbit.eccentricity = aprox(eccentricity, aproxValues && aproxValues.eccentricity) || 0;
      this.orbit.distance = aprox(distance, aproxValues && aproxValues.distance) || 0;
      // this.orbit.tilt = convert.radians(aprox(tilt, aproxValues && aproxValues.tilt) || 0);
      if (!this.orbit.tiltIsRadiants) {
        this.orbit.tilt = convert.radians(tilt);
        this.orbit.tiltIsRadiants = true;
      }

      // console.log(this.name, tilt, convert.radians(tilt));

      // console.log(this.name, 'orbitAround', this.orbit.parent.name, 'with mass', this.orbit.parent.mass, 'at', convert.to(this.orbit.distance));

      // speed of orbit in m/s to km/s
      const orbitSpeed = sqrt(6.67 * (10 ** -11) * (this.orbit.parent.mass / dimentionDivider) / this.orbit.distance) / 1000;
      // orbital period in s
      const orbitPeriod = PI * 2 * this.orbit.distance / orbitSpeed;

      this.nominalRadiantSpeed = PI / orbitPeriod;
    }
  }

  init() {

    cameraIndex.push(this);

    this.initThreeObj();

    if (this.orbit && this.orbit.parent) {
      this.orbitAround(this.orbit.parent);
    }
    // this.logMySelf();
  }

  logMySelf() {
    console.log(this);
  }

  initThreeObj() {
    const { radius, color } = this;

    // make a sphere and put it in threeObj
    const geometry = new THREE.SphereGeometry(radius, 25, 25);
    const material = new THREE.MeshPhongMaterial({ color });
    this.threeObj = new THREE.Mesh(geometry, material);

    this.uuid = this.threeObj.uuid;
    scene.add(this.threeObj);
  }

  setBaseRadialPosition(rad) {
    this.radialPosition = rad;
  }

  animate(delta) {
    // console.log('=====================');
    // console.log(this.name);
    if (this.orbit && this.orbit.parent) {

      const { nominalRadiantSpeed, orbit: { parent, distance, eccentricity, tilt } } = this;
      // console.log({ nominalRadiantSpeed, orbit: { parent, distance, eccentricity, tilt } });
      // console.log(this.name, this);
      // console.log(this.name, parent.name, parent.threeObj.position);
      const { cos, sin, PI, abs } = Math;

      const radialStep = nominalRadiantSpeed * delta;
      if (radialStep !== 0) this.radialPosition += radialStep;
      if (this.radialPosition > PI * 2) this.radialPosition -= PI * 2;
      this.threeObj.position.x = parent.threeObj.position.x + distance * eccentricity + cos(this.radialPosition) * (distance + distance * abs(eccentricity));
      this.threeObj.position.z = parent.threeObj.position.z + sin(this.radialPosition) * (distance - (distance * sin(tilt)));
      this.threeObj.position.y = parent.threeObj.position.y + sin(this.radialPosition) * distance * sin(tilt);
    }

    if (this.childs && this.childs.length) {
      this.childs.forEach((el) => {
        el.animate(delta);
      });
    }

    if (this.manageVisibility && camera && clock.getElapsedTime() > 4) this.manageVisibility(camera);
    // if (this.constructor.name === 'System') {
    //   this.childs.forEach((el) => {
    //     if (['Star', 'BinaryStars'].includes(el.constructor.name)) {
    //       el.turnLightOn(delta);
    //     }
    //   });
    // }
    // console.log('=====================');
  }

  manageVisibility(camera) {
    const { position: p } = this.threeObj;
    const { position: cp } = camera;
    const objVect = new THREE.Vector3(p.x, p.y, p.z);
    const camVect = new THREE.Vector3(cp.x, cp.y, cp.z);

    this.threeObj.getWorldPosition(objVect);
    camera.getWorldPosition(camVect);
    const d = camVect.distanceTo(objVect);

    if (d > 6000 * this.radius) scene.remove(this.threeObj);
    else scene.add(this.threeObj);

    if (this.manageLight) this.manageLight(d);
  }

}
