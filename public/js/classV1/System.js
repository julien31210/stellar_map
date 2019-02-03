
class System extends Astre {
  constructor(args) {
    super(args);


    this.childs = [
      new BinaryStars({
        name: `binaryStar${this.name}`,
        type: 'binary stars',
        tilt: 0,
        orbit: {
          parent: this,
          eccentricity: .4,
          tilt: 90,
          distance: convert.to('3M'),
        }
      }),
      new Astre({
        name: `earth${this.name}`,
        radius: convert.to(6371),
        color: 0x00ffff,
        type: 'planet',
        orbit: {
          parent: this.childs[0],
          distance: convert.to('149,6 M'),
          tilt: 0,
        },
        mass: 5.972 * (10 ** 24)
      }),
      new Astre({
        name: `moon${this.name}`,
        radius: convert.to(3474),
        color: 0xcccccc,
        type: 'planet',
        orbit: {
          parent: this.childs[1],
          distance: convert.to(384000),
          eccentricity: .1,
          tilt: 5.14,
        },
        mass: (7.36 * (10 ** 22))
      })];

    const { rad, mass } = this.childs.reduce((result, child) => {
      if (result.rad < child.orbit.distance * 2) result.rad = child.orbit.distance * 2;
      result.mass += child.mass;
      return result;
    }, { rad: 0, mass: 0 });

    this.radius = rad;
    this.mass = mass;

  }

  initThreeObj() {

    this.childs.forEach((el) => { el.orbitAround(this); });

    const geometry = new THREE.SphereGeometry(this.radius, 25, 25);
    const material = new THREE.MeshBasicMaterial();
    this.threeObj = new THREE.Mesh(geometry, material);
    this.threeObj.material.transparent = true;
    this.threeObj.material.opacity = 0.3;

    this.threeObj.position.set(this.position.x, this.position.y, this.position.z);

    this.orbit.parent.threeObj.add(this.threeObj)

    this.uuid = this.threeObj.uuid;
    this.radialPosition = Math.PI;
    // const asteroidBelt = new AsteroiBelt({
    //   name: 'asteroidBelt',
    //   radius: 30000,
    //   color: 0xcccccc,
    //   type: 'asteroid belt',
    //   orbit: {
    //     parent: sun,
    //     distance: (7.5 * (10 ** 6)),
    //     // distance: (1.75 * (10 ** 7)),
    //     nb: 1000,
    //     eccentricity: .1,
    //     tilt: 90,
    //     thickness: 5,
    //     aprox: {
    //       nb: 5,
    //       eccentricity: 20,
    //       tilt: 20,
    //       radius: 0,
    //       distance: 20,
    //     }
    //   }
    // });
    // this.childs.push(asteroidBelt);
  }

  setRadialPosition(rad) {

    this.radialPosition = rad;

    if (this.orbit && this.orbit.parent) {

      const { radialPosition, orbit: { parent, distance: d, eccentricity: ecc, tilt } } = this;
      const { cos, sin, abs } = Math;

      const cosrad = cos(radialPosition);
      const sinrad = sin(radialPosition);

      if (this.threeObjInited) {

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

  astreAnimate(delta) {

  }

  manageLight(d) {

    if (d < this.radius) {

      const turnLightOnRecurs = (el) => {
        if (el.light && !el.lightStats) {
          console.log(el.name, 'ON');
          el.turnLightOn();
        }
        if (el.childs) el.childs.forEach(turnLightOnRecurs);
      };

      this.childs.forEach(turnLightOnRecurs);

    } else {

      const turnLightOffRecurs = (el) => {
        if (el.light && el.lightStats) {
          console.log(el.name, 'OFF');
          el.turnLightOff();
        }
        if (el.childs) el.childs.forEach(turnLightOffRecurs);
      };

      this.childs.forEach(turnLightOffRecurs);
    }
  }
}
