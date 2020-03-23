
class BlackHole extends Astre {
  constructor(args) {
    super(args);

    if (this.entities && this.entities.nb > 0) {
      for (let i = 0; i < this.entities.nb; i += 1) {

        const entity = new Star(this.centerType({
            completName: `${this.name}'s Star${i + 1}`,
            name: `Star${i + 1}`,
            orbit: {
              parent: this,
              distance: convert.to('149,6 M') / 1000,
              eccentricity: .1,
              tilt: rand.on.n(0, 15)
            },
          }));

        entity.setRadialPosition(rand.radiant());
      }
    }
  }

  initThreeObj() {

    const eventHorizonGeometry = new THREE.SphereGeometry(this.radius, 50, 50);
    const eventHorizonMaterial = new THREE.MeshBasicMaterial( { envMap: this.textureCubeCenter, side: THREE.BackSide } )
    const eventHorizon = new THREE.Mesh(eventHorizonGeometry, eventHorizonMaterial);

    const blackHoleGeometry = new THREE.SphereGeometry(this.radius * .90, 75, 75);
    const blackHoleMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);

    this.add(eventHorizon);
    this.add(blackHole);

  }
}
