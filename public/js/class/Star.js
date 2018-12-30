
class Star extends Astre {
  constructor({ radius, color, type, mass, orbit }) {
    super({ radius, color, type, mass, orbit });
  }

  initThreeObj() {
    const { radius, color } = this;
    this.threeObj = sunlight({ color, colorlight: 0xffffff, intensity: 2, scope: 10000000, radius });

    this.uuid = this.threeObj.uuid;
    scene.add(this.threeObj);
  }

  animate(delta) {
    if (this.orbitObj && this.orbitObj.parent) {
      const { nominalRadiantSpeed, orbitObj: { parent, distance, eccentricity, tilt } } = this;
      const { cos, sin, PI } = Math;

      const radialStep = nominalRadiantSpeed * delta;
      if (radialStep !== 0) this.radialPosition += radialStep;
      if (this.radialPosition > PI * 100) this.radialPosition -= PI * 100;

      this.threeObj.position.x = parent.threeObj.position.x + distance * eccentricity + cos(this.radialPosition) * (distance + distance * eccentricity);
      this.threeObj.position.z = parent.threeObj.position.z + sin(this.radialPosition) * distance;
      this.threeObj.position.y = parent.threeObj.position.y + sin(this.radialPosition) * distance * (tilt / 100);
    }
  }
}
