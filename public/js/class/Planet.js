

class Planet extends Astre {
  constructor(args) {
    super(args);

    if (this.moons && this.moons.nb > 0) {
      for (let i = 0; i < this.moons.nb; i += 1) {
        const moon = new Planet({
          name: `${this.name}'s moon${i + 1}`,
          radius: convert.to(3474) / 1000,
          color: 0xcccccc,
          type: 'planet',
          orbit: {
            parent: this,
            distance: convert.to(rand.on.n(384000 / 3, 384000 * 2)) / 1000,
            eccentricity: .1,
            tilt: rand.on.n(0, 180),
          },
          mass: (7.36 * (10 ** 22))
        });
        moon.orbitAround(this);
      }
    }

  }


  initThreeObj() {
    const { radius, color } = this;

    // make a sphere and put it in threeObj
    const geometry = new THREE.SphereGeometry(radius, 25, 25);
    const material = new THREE.MeshPhongMaterial({ color });
    this.threeObj = new THREE.Mesh(geometry, material);


    this.baseThreeObj.add(this.threeObj);

    this.childsIds.push(this.threeObj.uuid);
  }
}
