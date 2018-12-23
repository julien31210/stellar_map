
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

      this.radiantPosition = range(Math.PI, -Math.PI, orbitPeriod * (30 / baseTimeSpeed));
      // this.radiantsIndex = Math.floor(Math.random() * (this.radiantPosition.length - 1));
      this.radiantsIndex = Math.floor(this.radiantPosition.length * 0.64);
    }

    // this.logMySelf();
    this.initThreeObj();
  }

  logMySelf() {
    console.log(this);
  }

  initThreeObj() {
    const { radius, color } = this;
    this.threeObj = sphere(radius * 2, color);
    this.uuid = this.threeObj.uuid;
    scene.add(this.threeObj);
  }

  orbit(stellarParent) {
    this.orbitObj.parent = stellarParent;
  }

  animate(s) {
    if (this.orbitObj && this.orbitObj.parent && this.radiantsIndex) {
      const { radiantPosition, orbitObj: { parent, distance } } = this;

      // const a = new THREE.Vector3(parent.threeObj.position.x, parent.threeObj.position.y, parent.threeObj.position.z);
      // const b = new THREE.Vector3(this.threeObj.position.x, this.threeObj.position.y, this.threeObj.position.z);
      // const d = a.distanceTo(b);

      if (this.radiantsIndex > radiantPosition.length - 1) this.radiantsIndex = 0;
      if (this.radiantsIndex < 0) this.radiantsIndex = radiantPosition.length - 1;
      if (s !== 0) {
        this.threeObj.position.x = parent.threeObj.position.x + Math.cos(radiantPosition[this.radiantsIndex]) * distance;
        this.threeObj.position.z = parent.threeObj.position.z + Math.sin(radiantPosition[this.radiantsIndex]) * distance;
        this.threeObj.position.y = parent.threeObj.position.y + Math.sin(radiantPosition[this.radiantsIndex]) * 0;
        this.radiantsIndex += s; // increment of mote then 1 for speeding up the sim
      }
    }
  }
}