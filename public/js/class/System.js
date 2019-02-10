
class System extends Astre {
  constructor(args) {
    super(args);

    // 1/3 to 1/2 of stars in univers are binaryStars => about 42%
    const center = rand.on.percent(42)
      ? new BinaryStars({
        name: `${this.name}'s center BinaryStars`,
        type1: this.centerType,
        type2: rand.on.object(starsTypes),
        radius: convert.to(3474) / 1000,
        mass: 7.36 * (10 ** 22),
        orbit: { parent: this },
      })
      : new Star(this.centerType({
        name: `${this.name}'s center Star`,
        orbit: { parent: this }
      }));

    this.center = center;
    this.mass = center.mass;

    if (this.entities && this.entities.nb > 0) {
      for (let i = 0; i < this.entities.nb; i += 1) {
        const entity = rand.on.percent(95)
          ? new Planet({
            completName: `${this.name}'s Planet${i + 1}`,
            name: `Planet${i + 1}`,
            radius: convert.to(3474) / 1000,
            color: 0x00cccc,
            type: 'planet',
            moons: { nb: rand.on.percent(50) ? 1 : 0 },
            orbit: {
              parent: this,
              distance: convert.to('149,6 M') / 1000,
              eccentricity: .1,
              tilt: rand.on.n(0, 15),
            },
            mass: (7.36 * (10 ** 22))
          })
          : new Star(this.centerType({
            completName: `${this.name}'s Star${i + 1}`,
            name: `Star${i + 1}`,
            orbit: {
              parent: this,
              distance: convert.to('149,6 M') / 1000,
              eccentricity: .1,
              tilt: rand.on.n(0, 15),
            },
          }));

        entity.setRadialPosition(rand.radiant());
      }
    }

    this.childs.forEach((el) => {
      el.orbitAround(this);
    });

    this.radius = this.childs.reduce((rad, child) => {
      const d = child.orbit.distance;
      if (rad < d * 1.5) return d * 1.5;
      return rad;
    }, 0);

  }

  initThreeObj() {
    this.threeObj = this.baseThreeObj;

    const geometry = new THREE.SphereGeometry(this.radius * 1.2, 25, 25);
    const material = new THREE.MeshBasicMaterial();
    const sphere = new THREE.Mesh(geometry, material);
    sphere.material.transparent = true;
    sphere.material.opacity = 0.3;
    this.childsIds.push(sphere.uuid);

    this.baseThreeObj.add(sphere);
  }
}
