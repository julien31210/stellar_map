
class BinaryStars extends Astre {
  constructor(args) {
    super(args);

    const tilt = rand.radiant();

    const star1 = new Star(this.type1({
      name: `${this.name}'s star1`,
      orbit: {
        eccentricity: .3,
        tilt,
        distance: convert.to('3M') / 1000,
      }
    }));

    const star2 = new Star(this.type2({
      name: `${this.name}'s star2`,
      orbit: {
        eccentricity: -.3,
        tilt,
        distance: convert.to('3M') / 1000,
      }
    }));

    this.childsIds.push(star1.uuid);
    this.childsIds.push(star2.uuid);

    this.star1 = star1;
    this.star2 = star2;


    const m1 = this.star1.mass;
    const m2 = this.star2.mass;


    const dist = this.star1.orbit.distance + this.star2.orbit.distance;

    this.mass = m1 + m2;
    this.radius = dist
      + (dist * .3) // for eccentricity
      + this.star1.radius
      + this.star2.radius;

    const dist1 = (m2 * dist) / (this.mass);
    const dist2 = (m1 * dist) / (this.mass);

    this.star1.orbit.distance = dist1;
    this.star2.orbit.distance = dist2;

    const center1 = {
      mass: this.star2.mass,
      dist1: dist2,
      dist2: dist1,
    };

    const center2 = {
      mass: this.star1.mass,
      dist1,
      dist2,
    };

    const star1orbit = this.star1.orbitAround(this, center1);
    const star2orbit = this.star2.orbitAround(this, center2);

    if (star1orbit.orbitPeriod > star2orbit.orbitPeriod) {
      this.star2.orbit.miror = this.star1;
      this.star2.orbitAround(this, { ...center2, ...star2orbit });
    } else {
      this.star1.orbit.miror = this.star2;
      this.star1.orbitAround(this, { ...center2, ...star2orbit });
    }

    this.star1.radialPosition = 0;
    this.star2.radialPosition = Math.PI;

    this.childs.push(this.star1, this.star2);

  }

  initThreeObj() {
    this.threeObj = this.groupThree;

    const geometry = new THREE.SphereGeometry(this.radius, 25, 25);
    const material = new THREE.MeshBasicMaterial();
    const sphere = new THREE.Mesh(geometry, material);
    sphere.material.transparent = true;
    sphere.material.opacity = 0.02;
    this.childsIds.push(sphere.uuid);

    this.groupThree.add(sphere);

  }

}
