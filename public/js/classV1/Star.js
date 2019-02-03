
class Star extends Astre {
  constructor(args) {
    super(args);
    this.lightStats = false;
  }

  initThreeObj() {
    const { radius, color } = this;
    const { star, light } = sunlight({ color, colorlight: 0xffffff, intensity: 2, scope: convert.to('149,6 M') * 2, radius });

    this.threeObj = star;
    this.light = light;
    this.uuid = this.threeObj.uuid;
    this.threeObj.position.set(this.position.x, this.position.y, this.position.z);
    scene.add(this.threeObj);
  }

  turnLightOn() {
    this.threeObj.add(this.light);
    console.log(this.light);
    this.lightStats = true;
  }

  turnLightOff() {
    this.threeObj.remove(this.light);
    this.lightStats = false;
  }
}
