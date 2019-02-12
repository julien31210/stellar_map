
class Astre {
  constructor(args) {
    this.groupThree = new THREE.Group();
    this.uuid = this.groupThree.uuid;
    this.lifeTime = 0;
    this.realLifeTime = 0;

    Object.keys(args)
      .forEach((key) => {
        this[key] = args[key];
      });

    if (
      this.density
      && this.radius
      && !this.mass
    ) this.mass = this.density * (4 / 3 * Math.PI * (this.radius ** 3));

    this.childs = [];
    this.radialPosition = this.radialPosition || Math.PI;
    this.on = false;
    this.threeObjInited = false;
    this.delayedDelta = 0;
    this.childsIds = [];

    this.position = {
      x: (this.position && this.position.x) || 0,
      y: (this.position && this.position.y) || 0,
      z: (this.position && this.position.z) || 0
    };

    if (this.orbit && this.orbit.parent) this.orbitAround();

    scene.add(this.groupThree);

    cameraIndex.push(this);


  }

  animate(delta, mult) {
    this.lifeTime = delta * mult;
    this.realLifeTime += delta;

    if (camera && this.realLifeTime > 4) this.manageVisibility(camera);

    if (this.realLifeTime > 2) {
      // if (this.realDelayedDelta > 1) {
      //   const delayed = this.delayedDelta;
      //   this.delayedDelta = 0;

      //   this.realDelayedDelta = 0;

      //   const d = delta * mult + delayed;
      //   this.move(d);

      // } else if (this.on) {

      const d = delta * mult;
      this.move(d);

      // } else {
      //   this.delayedDelta += delta * mult;
      //   this.realDelayedDelta += delta;
      //   this.move(0);
      // }
    }

    this.childs.forEach((el) => {
      el.animate(delta, mult);
    });


  }

  getDistanceToCamera(camera) {
    const camVect = new THREE.Vector3();
    camera.getWorldPosition(camVect);

    return camVect.distanceTo(this.getWorldPosition());
  }

  getWorldPosition() {
    const objVect = new THREE.Vector3();
    this.groupThree.getWorldPosition(objVect);

    return objVect;
  }

  manageVisibility(camera) {
    const d = this.getDistanceToCamera(camera);

    if (this.manageLight && this.threeObjInited) this.manageLight(d);

    if (d > 6000 * this.radius && this.on && this.threeObjInited) {
      this.on = false;
      scene.remove(this.groupThree);
    }

    if (d < 6000 * this.radius && !this.on) {

      if (!this.threeObjInited) {

        this.initThreeObj();
        this.threeObjInited = true;

        setTimeout(() => {
          if (this.getDistanceToCamera(camera) > 6000 * this.radius) {
            console.log(`wrongInitThreeobj on ${this.type || this.constructor.name}${this.uuid.slice(0, 4)}`);
          }
        }, 100);
      }
      this.on = true;

      scene.add(this.groupThree);
    }

  }

  move(delta, rad) {
    if (this.orbit && this.orbit.parent) {
      const { medianRadiantSpeed, radialPosition, orbit: { parent, distance: d, eccentricity: ecc, tilt } } = this;

      const parentPos = parent.getWorldPosition();

      const { PI } = Math;


      if (d > 0) {
        const { cos, sin, abs } = Math;

        const radialStep = rad || medianRadiantSpeed * delta;

        if (this.orbit.miror) {
          this.radialPosition = this.orbit.miror.radialPosition + PI;
        }
        if (radialStep !== 0) this.radialPosition += radialStep;

        if (this.radialPosition > PI * 2) this.radialPosition -= PI * 2;

        const cosrad = cos(radialPosition);
        const sinrad = sin(radialPosition);

        this.position.x = parentPos.x
          + d * (ecc || 0)
          + cosrad * (d + d * abs(ecc || 0));

        this.position.z = parentPos.z
          + sinrad * d * cos(tilt);

        this.position.y = parentPos.y
          + sinrad * d * sin(tilt);

      } else {
        this.position.x = parentPos.x;
        this.position.y = parentPos.y;
        this.position.z = parentPos.z;
      }

    }

    this.groupThree.position.x = this.position.x;
    this.groupThree.position.y = this.position.y;
    this.groupThree.position.z = this.position.z;
  }


  orbitAround(stellarParent, center) {
    const { sqrt, PI } = Math;
    if (stellarParent) this.orbit.parent = stellarParent;

    const f = this.orbit.parent.childs.filter(el => el.uuid === this.uuid);
    if (!f.length) this.orbit.parent.childs.push(this);

    const mass = (center && center.mass)
      ? center.mass
      : this.orbit.parent && this.orbit.parent.mass;

    const distance = (center && center.dist1 && center.dist2)
      ? (center.dist1 ** 2) + center.dist2
      : (this.orbit.distance ** 2) || 0;

    if (mass) {
      const { tilt } = this.orbit;

      // tilt to radiants
      if (!this.orbit.tiltIsRadiants) {
        this.orbit.tilt = convert.radians(tilt);
        this.orbit.tiltIsRadiants = true;
      }

      // speed of orbit in m/s to km/s
      const orbitSpeed = sqrt(
        6.673 * (10 ** -11) // Gravitational force const
        * mass
        / distance
      ) / 1000;
      // orbital period in s
      const orbitPeriod = PI * 2 * this.orbit.distance / orbitSpeed;

      this.medianRadiantSpeed = (center && center.medianRadiantSpeed) || PI / orbitPeriod;

      return { orbitPeriod, medianRadiantSpeed: this.medianRadiantSpeed };
    }

    setTimeout(() => {
      this.orbitAround(this.orbit.parent, center);
    }, 1000);

  }

  setRadialPosition(rad) {
    this.radialPosition = rad;

  }
}
