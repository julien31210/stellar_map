
class Star extends Astre {

  initThreeObj() {
    const { radius, color } = this;
    this.threeObj = sunlight({ color, colorlight: 0xffffff, intensity: 2, scope: toKm('149,6 M') * 2, radius });

    this.uuid = this.threeObj.uuid;
    scene.add(this.threeObj);
  }
}
