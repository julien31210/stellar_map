
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
    this.radialPosition = this.radialPosition || Math.PI;
    this.on = false;
    this.threeObjInited = false;
    this.delayedDelta = 0;

    this.position = {
      x: this.position.x || 0,
      y: this.position.y || 0,
      z: this.position.z || 0
    };

    if (typeof this.preconstruct === 'function') this.preconstruct();

    this.init();
  }

  orbitAround(stellarParent) {
    const { sqrt, PI } = Math;
    if (stellarParent) this.orbit.parent = stellarParent;

    const f = this.orbit.parent.childs.filter(el => el.uuid === this.uuid);
    if (!f.length) this.orbit.parent.childs.push(this);
    if (this.orbit.parent && this.orbit.parent.mass) {
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
    } else {
      setTimeout(() => {
        this.orbitAround(this.orbit.parent)
      }, 250)
    }
  }

  init() {

    cameraIndex.push(this);

    if (this.orbit && this.orbit.parent) this.orbitAround(this.orbit.parent);
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

    this.threeObj.position.set(this.position.x, this.position.y, this.position.z);

    this.uuid = this.threeObj.uuid;
  }

  setRadialPosition(rad) {
    this.radialPosition = rad;
  }

  astreAnimate(delta) {

    // console.log(this.name, 'astreAnimate');
    if (this.orbit && this.orbit.parent) {

      const { nominalRadiantSpeed, radialPosition, orbit: { parent, distance: d, eccentricity: ecc, tilt } } = this;
      const { cos, sin, PI, abs } = Math;


      const radialStep = nominalRadiantSpeed * delta;

      if (radialStep !== 0) this.radialPosition += radialStep;
      if (this.radialPosition > PI * 2) this.radialPosition -= PI * 2;

      const cosrad = cos(radialPosition);
      const sinrad = sin(radialPosition);

      if (this.threeObj) {

        this.threeObj.position.x = parent.threeObj.position.x
          + d * ecc
          + cosrad * (d + d * abs(ecc));

        this.threeObj.position.z = parent.threeObj.position.z
          + sinrad * d * cos(tilt);

        this.threeObj.position.y = parent.threeObj.position.y
          + sinrad * d * sin(tilt);
      } else {

        this.position.x = parent.position.x
          + d * ecc
          + cosrad * (d + d * abs(ecc));

        this.position.z = parent.position.z
          + sinrad * d * cos(tilt);

        this.position.y = parent.position.y
          + sinrad * d * sin(tilt);
      }
    }
  }

  animate(delta) {

    if (camera) this.manageVisibility(camera);

    if (this.on) {
      const delayed = this.delayedDelta;
      this.delayedDelta = 0;

      const d = delta + delayed;
      this.astreAnimate(d);

      if (this.childs && this.childs.length) {
        this.childs.forEach((el) => {
          el.astreAnimate(d);
        });
      }

    } else {
      this.delayedDelta += delta;
    }

    if (this.childs && this.childs.length) {
      this.childs.forEach((el) => {
        el.animate(delta);
      });
    }
  }

  manageVisibility(camera) {

    const { position: cp } = camera;
    const camVect = new THREE.Vector3(cp.x, cp.y, cp.z);
    camera.getWorldPosition(camVect);

    const { position: p } = this.threeObj || this;
    // console.log(this.name, p);
    const objVect = new THREE.Vector3(p.x, p.y, p.z);

    let d;
    if (this.threeObjInited) {
      this.threeObj.getWorldPosition(objVect);
      d = camVect.distanceTo(objVect);
    } else {
      // console.log(this.name, 'nope')
      d = camVect.distanceTo(objVect);
      // console.log(this.name, d)
    }

    if (d > 6000 * this.radius && this.on && this.threeObjInited) {

      this.on = false;
      scene.remove(this.threeObj);
    } else if (d < 6000 * this.radius && !this.on) {

      if (!this.threeObjInited) {
        this.initThreeObj();
        this.threeObjInited = true;
      }

      this.on = true;
      scene.add(this.threeObj);
    }

    if (this.manageLight) this.manageLight(d);
  }


}