
class Galaxy extends Astre {
  initThreeObj() {
    this.radius = 0;
    this.mass = 0;

    this.threeObj = new THREE.Object3D();
    this.threeObj.position.set(0, 0, 0);
    this.uuid = this.threeObj.uuid;

    this.childs = [];

    const branchesNumer = 2;
    const sysNumber = 120;

    for (let j = 0; j <= branchesNumer - 1; j += 1) {
      const brancheSysNumber = Math.floor(sysNumber / branchesNumer);

      for (let i = 0; i <= brancheSysNumber - 1; i += 1) {
        const sys = new System({
          name: `solarSys${i + (brancheSysNumber * j)}`,
          orbit: {
            parent: this,
            eccentricity: 0,
            distance: convert.to(`${i * 6 + 15 + j}B`),
            tilt: randOnN(0, 180),
          }
        });
        sys.radialPosition = ((2 * Math.PI) / sysNumber) * (brancheSysNumber - i) + ((2 * Math.PI) / branchesNumer) * j
      }
    }


    this.radius = this.childs.reduce((result, value) => {
      if (result < value.orbit.distance) return value.orbit.distance;
      return result;
    }, 0);


    const geometry = new THREE.SphereGeometry(this.radius, 50, 50);
    const material = new THREE.MeshBasicMaterial();
    this.threeObj = new THREE.Mesh(geometry, material);
    this.threeObj.material.transparent = true;
    this.threeObj.material.opacity = 0.03;

    this.childs.forEach((el, i) => {
      this.mass += el.mass;
    });

    this.childs.forEach(el => el.orbitAround(this));

  }
}
