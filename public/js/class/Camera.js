class Camera extends THREE.PerspectiveCamera {
  constructor({ camera: { fov, screenRatio, minDistance, maxDistance } }) {
    super(fov, screenRatio, minDistance, maxDistance);
    this.lastRot;
    scene.add(this);
    this.turnCrossAirOn()
  }

  teleportTo(o) {
    const log = {
      a: `${o.uuid.slice(0, 4)}${o.name}`,
      t: o.type || o.constructor.name,
      pos: o.position,
      i: o.threeObjInited,
      parentp: o.orbit && o.orbit.parent && o.orbit.parent.position,
      o,
      r: o.radius
    };

    // teleportation start
    o.groupThree.add(this);
    this.position.set(0, 0, o.radius * 7);
    this.lookAt(o.groupThree.position);
    // this.position.set(o.position.x, o.position.y, o.position.z + o.radius * 6);
    const cp = new THREE.Vector3();
    this.getWorldPosition(cp);
    mouseWheelSpeed = o.radius * 5;
    // teleportation end


    log.cp = cp;

    const opos = new THREE.Vector3();
    const universpos = new THREE.Vector3();
    o.groupThree.getWorldPosition(opos);

    log.distance = opos.distanceTo(cp) / o.radius;
    log.distanceUniers = opos.distanceTo(universpos) / o.radius;

    const cp1 = new THREE.Vector3();
    this.getWorldPosition(cp1);

    setTimeout(() => {

      const cp2 = new THREE.Vector3();
      this.getWorldPosition(cp2);

      log.cpDiff = cp2.distanceTo(cp1);

      console.log(log);
    }, 250);

  }

  onMouseMove(e, mousepressed) {

    const isLocked = document.pointerLockElement === document.getElementById('blocker');

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    const newRot = { x: e.clientX, y: e.clientY };
    if (mousepressed && !isLocked) {
      this.rotateX(((this.lastRot.y - newRot.y) / (100 / mouseSen)) * delta);
      this.rotateY(((this.lastRot.x - newRot.x) / (100 / mouseSen)) * delta);
    }
    this.lastRot = newRot;

    if (isLocked) {
      const movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
      const movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

      this.rotateX((-movementY / (150 / mouseSen)) * delta);
      this.rotateY((-movementX / (150 / mouseSen)) * delta);
    }

  }

  // CROSSAIR
  initCrossAir() {
    console.log('initCrossAir');
    const geometry = new THREE.BoxGeometry(.01, .01, .01);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.crossAir = new THREE.Object3D();

    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(.02, 0, 0);
    const cube1 = new THREE.Mesh(geometry, material);
    cube1.position.set(-.02, 0, 0);
    const cube2 = new THREE.Mesh(geometry, material);
    cube2.position.set(0, .02, 0);
    const cube3 = new THREE.Mesh(geometry, material);
    cube3.position.set(0, -.02, 0);
    this.crossAir.add(cube, cube1, cube2, cube3);

    this.crossAir.position.set(0, 0, -5);
    this.add(this.crossAir);

  }

  turnCrossAirOn() {
    console.log('turnCrossAirOn');
    if (this.crossAir) this.add(this.crossAir);
    else this.initCrossAir();
  }

  turnCrossAirOff() {
    console.log('turnCrossAirOff');
    if (this.crossAir) this.remove(this.crossAir);
    else this.initCrossAir();
  }

}
