
class Galaxy extends Astre {
  constructor(args) {
    super(args);
    const PI2 = Math.PI * 2;
    const { n, object: rObject } = rand.on;

    console.log(`density: ${this.density},\nspiralStrength: ${this.spiralStrength},\nbranchesNumber: ${this.branchesNumber}`);

    for (let j = 0; j < this.branchesNumber; j += 1) {
      const brancheSysNumber = Math.floor(this.sysNumber / this.branchesNumber);

      for (let i = 0; i <= brancheSysNumber - 1; i += 1) {
        const sys = new System({
          name: `solarSys${i + (brancheSysNumber * j)}`,
          centerType: rObject(starsTypes),
          entities: {
            nb: i === 0 && j === 0 ? 5 : n(1, 2)
          },
          orbit: {
            parent: this,
            eccentricity: 0,
            distance: convert.to(`${(i / this.density) * 10 + 25 + j}B`) / 1000,
            tilt: n(-90 + (90 / brancheSysNumber) * i, 90 - (90 / brancheSysNumber) * i)
          }
        });
        sys.setRadialPosition(
          (PI2 * this.spiralStrength / this.sysNumber) * (brancheSysNumber - i)
          + (PI2 / this.branchesNumber) * j
        );

        sys.orbitAround(this);
      }
    }
    this.mass = 0;
    this.childs.forEach((el, i) => {
      this.mass += el.mass;
    });

    this.radius = this.childs.reduce((result, value) => {
      if (result < value.orbit.distance) return value.orbit.distance;
      return result;
    }, 0);

  }

  initThreeObj() {
    this.threeObj = this.baseThreeObj;

    const geometry = new THREE.SphereGeometry(this.radius, 25, 25);
    const material = new THREE.MeshBasicMaterial();
    const sphere = new THREE.Mesh(geometry, material);
    sphere.material.transparent = true;
    sphere.material.opacity = 0.01;

    const geometry2 = new THREE.SphereGeometry(this.radius / 100000, 25, 25);
    const material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const sphere2 = new THREE.Mesh(geometry2, material2);

    this.baseThreeObj.add(sphere, sphere2);
  }
}
