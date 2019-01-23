
class BinaryStars extends Astre {


  initThreeObj() {
    this.threeObj = new THREE.Object3D();

    this.mass = this.star1.mass + this.star2.mass;
    this.radius = this.star1.radius + this.star2.radius;

    this.star1.radialPosition = 0;
    this.star1.orbitAround(this);

    this.star2.radialPosition = Math.PI;
    this.star2.orbitAround(this);

    this.threeObj.rotateX(this.tilt || 0);
    this.uuid = this.threeObj.uuid;

    scene.add(this.threeObj);
  }

  astreAnimate(delta) {
    if (this.orbit && this.orbit.parent) {

      const { orbit: { parent } } = this;

      this.threeObj.position.x = parent.threeObj.position.x;
      this.threeObj.position.z = parent.threeObj.position.z;
      this.threeObj.position.y = parent.threeObj.position.y;
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
