
class BinaryStars extends Astre {


  initThreeObj() {
    this.threeObj = new THREE.Object3D();

    this.mass = this.star1.mass + this.star2.mass;
    this.radius = this.star1.radius + this.star2.radius;

    this.star1.radialPosition = 0;
    this.star1.orbitAround(this);
    scene.add(this.star1.threeObj);

    this.star2.radialPosition = Math.PI;
    this.star2.orbitAround(this);
    scene.add(this.star2.threeObj);

    this.threeObj.rotateX(this.tilt || 0);
    this.uuid = this.threeObj.uuid;

    scene.add(this.threeObj);
  }

  nestedAnimate(delta) {
    this.star1.animate(delta);
    this.star2.animate(delta);
  }
}