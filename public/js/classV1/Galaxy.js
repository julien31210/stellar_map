
class Galaxy extends Astre {
  constructor(args) {
    super(args);
    // this.mass = 0;
    // this.radius = 0;
    const branchesNumer = 3;
    const sysNumber = 150;

    for (let j = 0; j <= branchesNumer - 1; j += 1) {
      const brancheSysNumber = Math.floor(sysNumber / branchesNumer);

      for (let i = 0; i <= brancheSysNumber - 1; i += 1) {
        const sys = new System({
          name: `solarSys${i + (brancheSysNumber * j)}`,
          orbit: {
            parent: this,
            eccentricity: 0,
            distance: convert.to(`${i * 6 + 15 + j}B`),
            tilt: rand.on.n(0, 180),
          }
        });
        sys.setRadialPosition(((2 * Math.PI) / sysNumber) * (brancheSysNumber - i) + ((2 * Math.PI) / branchesNumer) * j);
      }
    }

    this.childs.forEach((el, i) => {
      this.mass += el.mass;
    });
    console.log(this.mass)

    this.radius = this.childs.reduce((result, value) => {
      if (result < value.orbit.distance) return value.orbit.distance;
      return result;
    }, 0);

  }

  initThreeObj() {

    this.threeObj = new THREE.Object3D();
    this.threeObj.position.set(0, 0, 0);
    this.uuid = this.threeObj.uuid;

    const geometry = new THREE.SphereGeometry(this.radius, 25, 25);
    const material = new THREE.MeshBasicMaterial();
    this.threeObj = new THREE.Mesh(geometry, material);
    this.threeObj.material.transparent = true;
    this.threeObj.material.opacity = 0.03;
    console.log(this.childs);

    this.threeObj.position.set(this.position.x, this.position.y, this.position.z);

    this.childs.forEach(el => el.orbitAround(this));

  }
}
