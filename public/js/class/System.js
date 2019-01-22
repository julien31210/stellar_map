
class System extends Astre {
  initThreeObj() {

    console.log(this.name, this.orbit.tilt);

    const sun = new Star({
      name: 'sun',
      radius: convert.to(695508), // 6.95 508
      color: 0xf0f00f,
      mass: ((1.989 / 2) * (10 ** 30)),
      type: 'star',
      orbit: {
        eccentricity: .4,
        tilt: 90,
        distance: convert.to('3M'),
      }
    });
    const sun2 = new Star({
      name: 'sun2',
      radius: convert.to(695508),
      color: 0xf0f00f,
      mass: ((1.989 / 2) * (10 ** 30)),
      type: 'star',
      orbit: {
        eccentricity: -.4,
        tilt: 90,
        distance: convert.to('3M'),
      }
    });

    const binaryStars = new BinaryStars({
      name: 'binaryStars',
      type: 'binary stars',
      star1: sun,
      star2: sun2,
      tilt: 0,
      orbit: {
        parent: this,
        eccentricity: .4,
        tilt: 90,
        distance: convert.to('3M'),
      }
    });

    const earth = new Astre({
      name: 'earth',
      radius: convert.to(6371),
      color: 0x00ffff,
      type: 'planet',
      orbit: {
        parent: binaryStars,
        distance: convert.to('149,6 M'),
        tilt: 0,
      },
      mass: 5.972 * (10 ** 24)
    });

    const moon = new Astre({
      name: 'moon',
      radius: convert.to(3474),
      color: 0xcccccc,
      type: 'planet',
      orbit: {
        parent: earth,
        distance: convert.to(384000),
        eccentricity: .1,
        tilt: 5.14,
      },
      mass: (7.36 * (10 ** 22))
    });

    this.mass = sun.mass
      + sun2.mass
      + earth.mass
      + moon.mass;
    this.radius = [
      sun,
      sun2,
      earth,
      moon
    ].reduce((result, value) => {
      if (result < value.orbit.distance) return value.orbit.distance + binaryStars.radius;
      return result;
    }, 0) + binaryStars.radius;

    binaryStars.orbitAround(this);

    const geometry = new THREE.SphereGeometry(this.radius, 25, 25);
    const material = new THREE.MeshBasicMaterial();
    this.threeObj = new THREE.Mesh(geometry, material);
    this.threeObj.material.transparent = true;
    this.threeObj.material.opacity = 0.3;

    this.uuid = this.threeObj.uuid;
    this.radialPosition = Math.PI;
    console.log(this.radius, this.mass, this.childs);
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
