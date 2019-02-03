
class BinaryStars extends Astre {
  constructor(args) {
    super(args);

    this.star1 = new Star({
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
    this.star2 = new Star({
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

    this.mass = this.star1.mass + this.star2.mass;
    this.radius = this.star1.radius + this.star2.radius;

    this.star1.radialPosition = 0;

    this.star2.radialPosition = Math.PI;


  }

  initThreeObj() {
    this.threeObj = new THREE.Object3D();

    this.star1.orbitAround(this);

    this.star2.orbitAround(this);

    this.threeObj.rotateX(this.tilt || 0);
    this.threeObj.position.set(this.position.x, this.position.y, this.position.z);

    this.uuid = this.threeObj.uuid;
    scene.add(this.threeObj);
  }

  astreAnimate(delta) {
    if (this.orbit && this.orbit.parent) {

      const { orbit: { parent } } = this;

      if (this.threeObj) {

        this.threeObj.position.x = parent.threeObj.position.x;
        this.threeObj.position.z = parent.threeObj.position.z;
        this.threeObj.position.y = parent.threeObj.position.y;
      } else {

        this.position.x = parent.position.x;
        this.position.z = parent.position.z;
        this.position.y = parent.position.y;
      }
    }
  }

  turnLightOn() {
    this.childs.forEach((el) => {
      console.log('ok');
      if (el.light && !el.lightStats) el.turnLightOn();
    });
  }

  turnLightOff() {
    this.childs.forEach((el) => {
      console.log('ok');
      if (el.light && el.lightStats) el.turnLightOff();
    });
  }
}
