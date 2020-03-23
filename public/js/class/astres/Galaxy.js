
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
          name: `solarSys${i + (brancheSysNumber * j)}-branch${j}`,
          centerType: rObject(starsTypes),
          entities: {
            nb: n(1, 2)
          },
          orbit: {
            parent: this,
            eccentricity: 0,
            distance: convert.to(`${(i / this.density) * 10 + 25 + j}B`) / 1000,
            tilt: n(-90 + (90 / brancheSysNumber) * i, 90 - (90 / brancheSysNumber) * i)
            // tilt: 0
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

    const blackHole = new BlackHole({
      completName: `${this.name}'s BlackHole${i + 1}`,
      name: `BlackHole${i + 1}`,
      radius: this.radius / 10000,
      type: 'BlackHole',
      orbit: {
        parent: this,
        distance: 0,
        eccentricity: .1,
        tilt: 0,
      },
      mass: (7.36 * (10 ** 22)),
      textureCubeCenter: this.textureCubeCenter,
    });
    this.center = blackHole;
  }

  initThreeObj() {

    const geometry = new THREE.SphereGeometry(this.radius * 1.2, 25, 25);
    const material = new THREE.MeshBasicMaterial();
    const sphere = new THREE.Mesh(geometry, material);
    sphere.material.transparent = true;
    sphere.material.opacity = 0.01;

    this.add(sphere);
  }
}
