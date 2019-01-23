
class Galaxy extends Astre {
  initThreeObj() {
    this.radius = 0;
    this.mass = 0;

    this.threeObj = new THREE.Object3D();
    this.threeObj.position.set(0, 0, 0);
    this.uuid = this.threeObj.uuid;

    this.childs = [];

    for (let i = 1; i <= 150; i += 1) {
      const sys = new System({
        name: `solarSys${i}`,
        orbit: {
          parent: this,
          eccentricity: 0,
          distance: convert.to(`${i + 15}B`),
          // tilt: 0,
          tilt: randOnN(0, 50),
        }
      });
    }


    this.radius = this.childs.reduce((result, value) => {
      if (result < value.orbit.distance) return value.orbit.distance;
      return result;
    }, 0);

    this.childs.forEach((el) => {
      this.mass += el.mass;
      // el.radialPosition = ((2 * Math.PI) / this.childs.length) * i;
    });

    this.childs.forEach(el => el.orbitAround(this));

  }
}
