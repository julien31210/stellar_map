
class Astre {
  constructor({ radius, color, type, mass, orbit }) {
    // DOC
    // orbit = {
    //   parent = orbital direct parent,
    //   distance = distance between parent and this astral object,
    // }

    this.mass = mass;
    this.type = type;
    this.radius = radius;
    this.color = color;
    this.orbitObj = orbit;

    this.init();

  }

  init() {

    if (this.orbitObj && this.orbitObj.parent && this.orbitObj.parent.mass && this.orbitObj.distance) {

      const orbitSpeed = (Math.sqrt(6.67 * (10 ** -11) * this.orbitObj.parent.mass / this.orbitObj.distance)) / dimentionsDivider;
      const orbitPeriod = Math.PI * 2 * this.orbitObj.distance / orbitSpeed;
      console.log('orbitSpeed', orbitSpeed);
      console.log('orbitPeriod', orbitPeriod);

      this.radialPosition = Math.PI;
      this.nominalRadiantSpeed = ((2 * Math.PI - Math.PI) / orbitPeriod);
    }

    // this.logMySelf();
    this.initThreeObj();
  }

  logMySelf() {
    console.log(this);
  }

  initThreeObj() {
    const { radius, color } = this;
    if (this.type === 'star') {
      this.threeObj = sunlight({ color, intensity: 2, scope: 10000000, radius });
    } else {
      this.threeObj = sphere(radius, color);
    }

    this.uuid = this.threeObj.uuid;
    scene.add(this.threeObj);
  }

  orbit(stellarParent) {
    this.orbitObj.parent = stellarParent;
  }

  animate(delta) {
    if (this.orbitObj && this.orbitObj.parent) {
      const { nominalRadiantSpeed, orbitObj: { parent, distance } } = this;

      // const a = new THREE.Vector3(parent.threeObj.position.x, parent.threeObj.position.y, parent.threeObj.position.z);
      // const b = new THREE.Vector3(this.threeObj.position.x, this.threeObj.position.y, this.threeObj.position.z);
      // const d = a.distanceTo(b);
      if (delta !== 0) this.radialPosition += nominalRadiantSpeed * delta;
      this.threeObj.position.x = parent.threeObj.position.x + Math.cos(this.radialPosition) * distance;
      this.threeObj.position.z = parent.threeObj.position.z + Math.sin(this.radialPosition) * distance;
      this.threeObj.position.y = parent.threeObj.position.y + Math.sin(this.radialPosition) * 0;

    }
  }
}
