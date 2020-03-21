
class Star extends Astre {
  constructor(args) {
    super(args);

    this.lightOn = false;
    this.scope = (convert.to('149,6 M') * 2) / 1000;
  }

  initThreeObj() {
    const { radius, color, scope } = this;
    const { star, light } = sunlight({ color, colorlight: 0xffffff, intensity: 1, scope: scope * 2, radius });

    this.threeObj = star;
    this.light = light;
    this.childsIds.push(this.threeObj.uuid);

    this.add(this.threeObj);
  }

  turnLightOn() {
    this.add(this.light);
    this.lightOn = true;
  }

  turnLightOff() {
    this.remove(this.light);
    this.lightOn = false;
  }

  manageLight(d) {

    if (d < this.scope && !this.lightOn && this.threeObjInited) this.turnLightOn();
    else if (d > this.scope && this.lightOn) this.turnLightOff();
  }

}
