
class Icon extends THREE.Group {
  constructor({
    astre
  }) {
    super();

    this.isIcon = true;

    this.astre = astre;
    this.uuids = [];

    if (icons[this.astre.constructor && this.astre.constructor.name]) {

      this.icontype = icons[this.astre.constructor && this.astre.constructor.name];
      this.icon = this.icontype(this.astre);
      if (!this.icon) return undefined;
      // console.log('this.icon.children', this.icon.children);
      this.add(this.icon);
    }
  }

  animate() {

    // Get astre's world position
    const astredPos = new THREE.Vector3();
    this.astre.getWorldPosition(astredPos);
    // transform position to camera local
    this.worldToLocal(astredPos);
    // set the vector's length
    astredPos.setLength(60);
    this.position.set(astredPos.x, astredPos.y, astredPos.z);
  }

  changeColor(newColor) {

    this.children.forEach((obj) => {
      if (obj.material) obj.material.color.set(newColor);

      if (obj.children.lenght > 0) {

        obj.children.forEach((element) => {
          if (element.material) element.material.color.set(c);

          if (element.children.lenght > 0) {

            element.children.forEach((element2) => {
              if (element2.material) element2.material.color.set(c);

            });
          }
        });
      }
    });
  }

}
