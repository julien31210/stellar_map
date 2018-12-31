
class BinaryStars extends Astre {
  constructor({ radius, color, type, mass, orbit }) {
    super({ radius, color, type, mass, orbit });
  }

  // binaryStars = new BinaryStars({
  //   type: 'binary stars',
  //   orbit: {
  //     distance: (1.8957 * (10 ** 7)) / dimentionsDivider,
  //     binary: {
  //       distance: (1.8957 * (10 ** 7)) / dimentionsDivider,
  //     }
  //   }
  // });

  // const sun = new Star({
  //   radius: 6.957 * (10 ** 6) / dimentionsDivider,
  //   color: 0xf0f00f,
  //   mass: (1.989 * (10 ** 30)) / dimentionsDivider,
  //   type: 'star'
  // });
  // univers.push(sun);


  // const earth = new Astre({
  //   radius: 6.371 * (10 ** 3) / dimentionsDivider,
  //   color: 0x00ffff,
  //   type: 'planet',
  //   orbit: {
  //     parent: binaryStars,
  //     distance: 1.49 * (10 ** 8) / dimentionsDivider,
  //     tilt: 30,
  //   },
  //   mass: 5.972 * (10 ** 24) / dimentionsDivider
  // });
  // univers.push(earth);


  initThreeObj() {
    // const { radius, color } = this;

    this.threeObj = new THREE.Object3D();

    const star1 = new Star({
      orbit: {
        parent: this,
        distance: this.orbitObj.binary.distance,
        tilt: this.orbitObj.binary.tilt,
        eccentricity: this.orbitObj.eccentricity
      },
      radius: 3.957 * (10 ** 6) / dimentionsDivider,
      color: 0xf0f00f,
      mass: (1.989 * (10 ** 30)) / dimentionsDivider,
      type: 'star'
    });
    this.threeObj.add(star1.threeObj);
    univers.push(star1);

    const star2 = new Star({
      orbit: {
        parent: this,
        distance: this.orbitObj.binary.distance,
        tilt: this.orbitObj.binary.tilt,
        eccentricity: this.orbitObj.eccentricity
      },
      radius: 3.957 * (10 ** 6) / dimentionsDivider,
      color: 0xf00f0f,
      mass: (1.989 * (10 ** 30)) / dimentionsDivider,
      type: 'star'
    });
    this.threeObj.add(star2.threeObj);
    star2.setBaseRadialPosition(2 * Math.PI)
    univers.push(star2);

    this.orbitObj.star1 = star1;
    this.orbitObj.star2 = star2;
    // this.orbitObj.eccentricity = aprox(eccentricity, aproxValues && aproxValues.eccentricity) / 100;

    this.threeObj.rotateX(0);
    this.uuid = this.threeObj.uuid;

    console.log(this.threeObj)

    scene.add(this.threeObj);
  }

  orbit(stellarParent) {
    this.orbitObj.parent = stellarParent;
  }

  animate(delta) {
    if (this.orbitObj && this.orbitObj.binary && this.orbitObj.binary.distance) {
      // console.log('ok')
      const { nominalRadiantSpeed, orbitObj: { binary: { distance } } } = this;
      const { cos, sin, PI } = Math;

      const radialStep = nominalRadiantSpeed * delta;
      if (radialStep !== 0) this.radialPosition += radialStep;
      if (this.radialPosition > PI * 100) this.radialPosition -= PI * 100;

      this.orbitObj.star1.animate(delta);
      this.orbitObj.star2.animate(delta);
      // this.orbitObj.star1.threeObj.position.x = this.threeObj.position.x + distance + cos(this.radialPosition) * distance;
      // this.orbitObj.star1.threeObj.position.z = this.threeObj.position.z + sin(this.radialPosition) * distance;
      // this.orbitObj.star1.threeObj.position.y = this.threeObj.position.y + sin(this.radialPosition) * distance;

      // this.orbitObj.star2.threeObj.position.x = this.threeObj.position.x + distance + cos(this.radialPosition + PI) * distance;
      // this.orbitObj.star2.threeObj.position.z = this.threeObj.position.z + sin(this.radialPosition + PI) * distance;
      // this.orbitObj.star2.threeObj.position.y = this.threeObj.position.y + sin(this.radialPosition + PI) * distance;
    }
  }
}
