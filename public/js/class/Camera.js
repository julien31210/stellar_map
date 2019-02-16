class Camera extends THREE.PerspectiveCamera {
  constructor({
    camera: {
      fov,
      screenRatio,
      minDistance,
      maxDistance
    }, mouse: {
      mouseSen
    }
  }) {
    super(fov, screenRatio, minDistance, maxDistance);

    this.mouseSen = mouseSen;
    this.isLocked = false;
    this.lastRot;
    scene.add(this);
    this.turnCrossAirOn();

    this.autoSpeed = 0;
    this.autoSpeedToggled = false;


    this.cameraRaycaster = new THREE.Raycaster();
    this.mouseOvers = [];

    this.mouse = new THREE.Vector2();
    this.mousePressed = false;

    this.teleportIndex = 0;
  }

  teleportTo(obj) {

    this.clipTo(obj); // add this to object

    this.position.set(0, 0, obj.radius * 7);
    this.lookAt(obj.groupThree.position);

    mouseWheelSpeed = obj.radius * 5;

  }

  clipTo(obj) {

    if (this.clipedTo && obj && this.clipedTo.uuid === obj.uuid) return;

    this.clipedTo = obj;

    this.matrix.copy(this.matrixWorld);
    this.applyMatrix(new THREE.Matrix4().getInverse(obj.groupThree.matrixWorld));
    obj.groupThree.add(this);

  }

  unClip() {
    if (this.clipedTo) {
      this.applyMatrix(this.clipedTo.groupThree.matrixWorld);
      this.clipedTo.groupThree.remove(this);
      scene.add(this);

      this.clipedTo = false;
    }
  }

  quickRepeatListeners(k) {

    if (k === current_controls.forward) {
      if (!this.autoSpeedToggled) this.translateZ(-mouseWheelSpeed * delta);
      else this.translateZ(-this.autoSpeed * delta);
    }
    if (k === current_controls.back) this.translateZ(mouseWheelSpeed * delta);
    if (k === current_controls.right) this.translateX(mouseWheelSpeed * delta);
    if (k === current_controls.left) this.translateX(-mouseWheelSpeed * delta);
    if (k === current_controls.up) this.translateY(mouseWheelSpeed * delta);
    if (k === current_controls.down) this.translateY(-mouseWheelSpeed * delta);

    if (k === current_controls.roll.left) this.rotateZ((Math.PI / this.mouseSen / 7) * delta);
    if (k === current_controls.roll.right) this.rotateZ(-(Math.PI / this.mouseSen / 7) * delta);
  }

  normalListeners(k) {

    if (k == current_controls.camera.speedUp) mouseWheelSpeed += mouseWheelSpeed / 2;
    if (k == current_controls.camera.slowDown) mouseWheelSpeed -= mouseWheelSpeed / 2;
    if (k == current_controls.camera.toggleAutoSpeed) this.autoSpeedToggled = !this.autoSpeedToggled;

    if (k == 13) {
      if (!this.isLocked) {
        document.getElementById('blocker').requestPointerLock(); // lock the mouse
      } else document.exitPointerLock(); // unlock the mouse
    }

    if (k == current_controls.camera.teleportToNextIndex && parseInt(this.teleportIndex, 10) + 1 <= cameraIndex.length) {
      this.teleportIndex = parseInt(this.teleportIndex, 10) + 1;
      if (cameraIndex[this.teleportIndex - 1]) this.teleportTo(cameraIndex[this.teleportIndex - 1]);
    }
    if (k == current_controls.camera.teleportToPrevIndex && this.teleportIndex - 1 > 0) {
      this.teleportIndex = parseInt(this.teleportIndex, 10) - 1;
      if (cameraIndex[this.teleportIndex - 1]) this.teleportTo(cameraIndex[this.teleportIndex - 1]);
    }
  }

  onMouseDown(e) {
    if (e.button === 0) { // if pressed button is left button
      this.mousePressed = true;

      if (
        !this.isLocked
        && this.mouseOvers.length
        && getAstreByUuid(this.mouseOvers[0].object.uuid)
      ) console.log(getAstreByUuid(this.mouseOvers[0].object.uuid));
    }
  }

  onContextMenu(e) {

    if (
      !this.isLocked
      && this.mouseOvers.length
      && getAstreByUuid(this.mouseOvers[0].object.uuid)
    ) console.log(getAstreByUuid(this.mouseOvers[0].object.uuid));
  }


  onMouseUp(e) {
    if (e.button === 0) this.mousePressed = false;
  }


  onMouseMove(e) {

    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    const newRot = { x: e.clientX, y: e.clientY };
    if (this.mousePressed && !this.isLocked) {
      this.rotateX(((this.lastRot.y - newRot.y) / (25 / this.mouseSen)) * delta);
      this.rotateY(((this.lastRot.x - newRot.x) / (25 / this.mouseSen)) * delta);
    }
    this.lastRot = newRot;

    if (this.isLocked) {
      const movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
      const movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

      if (!this.crossAirRotationCenter) this.initCrossAir();

      this.crossAirRotationCenter.rotateX((-movementY / (100 / this.mouseSen)) * delta);
      this.crossAirRotationCenter.rotateY((-movementX / (100 / this.mouseSen)) * delta);
    }

  }

  // CROSSAIR
  initCrossAir() {
    const geometry = new THREE.BoxGeometry(.01, .01, .01);
    this.crossAirMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.crossAir = new THREE.Object3D();

    this.crossAirRotationCenter = new THREE.Object3D();

    const cube = new THREE.Mesh(geometry, this.crossAirMaterial);
    const cube1 = new THREE.Mesh(geometry, this.crossAirMaterial);
    const cube2 = new THREE.Mesh(geometry, this.crossAirMaterial);
    const cube3 = new THREE.Mesh(geometry, this.crossAirMaterial);

    cube.position.set(.02, 0, 0);
    cube1.position.set(-.02, 0, 0);
    cube2.position.set(0, .02, 0);
    cube3.position.set(0, -.02, 0);
    this.crossAir.add(cube, cube1, cube2, cube3);

    this.crossAir.position.set(0, 0, -5);

    this.crossAirRotationCenter.add(this.crossAir);

    this.add(this.crossAirRotationCenter);

  }

  turnCrossAirOn() {
    if (this.crossAirRotationCenter) this.add(this.crossAirRotationCenter);
    else this.initCrossAir();
  }

  turnCrossAirOff() {
    if (this.crossAirRotationCenter) this.remove(this.crossAirRotationCenter);
    else {
      this.initCrossAir();
      this.turnCrossAirOff();
    }
  }

  animate(delta) {
    this.isLocked = document.pointerLockElement === document.getElementById('blocker');
    const cliped = this.clipedTo;
    if (cliped && cliped.radius * 10 < cliped.getDistanceToCamera(this)) this.unClip();

    if (this.isLocked) {

      // Get world quaternion of the crossAir
      const crossAirWorldQ = new THREE.Quaternion();
      this.crossAirRotationCenter.getWorldQuaternion(crossAirWorldQ);
      crossAirWorldQ.normalize();

      // Bring camera quaternion in direction of the world quaternion of the crossAir
      const cameraQ = this.quaternion;
      const angle = crossAirWorldQ.angleTo(cameraQ);

      cameraQ.slerp(crossAirWorldQ, .55 + (angle * 2 * delta));

      // Bring quaternion of the crossAir in direction of the center of the screen (0, 0, 0)
      const center = new THREE.Quaternion(0, 0, 0, 1);

      const crossAirQ = this.crossAirRotationCenter.quaternion.normalize();
      const angle2 = crossAirQ.angleTo(cameraQ);

      crossAirQ.slerp(center, .55 + (angle2 * 2 * delta));

      this.crossAirRotationCenter.applyQuaternion(crossAirQ);
    }

    // RAYCASTERS
    // CROSS AIR RAYCASTER
    const crossAirRaycaster = new THREE.Raycaster();

    // get crossAir world
    const v = new THREE.Vector3();
    this.crossAir.getWorldPosition(v);

    const cp = new THREE.Vector3();
    this.getWorldPosition(cp);

    const dir = new THREE.Vector3(); // create once an reuse it
    dir.subVectors(v, cp).normalize();

    crossAirRaycaster.set(cp, dir);

    const crossAirIntersect = crossAirRaycaster.intersectObjects(scene.children, true);

    const aimedAstre = crossAirIntersect[0] ? getAstreByUuid(crossAirIntersect[0].object && crossAirIntersect[0].object.uuid) : false;

    if (aimedAstre) {

      const d = aimedAstre.getDistanceToCamera(camera);
      const { radius } = aimedAstre;

      // '"Le Saut Quantique", omelette du fromage'
      if (this.autoSpeedToggled) {
        this.crossAirMaterial.color.set(0x0000ff);
        const newSpeed = ((d + radius) ** 1.075);
        this.autoSpeed = newSpeed;
      } else this.crossAirMaterial.color.set(0x00ff00);

      if (d < mouseWheelSpeed / 2 && !this.autoSpeedToggled) {
        mouseWheelSpeed = (d + radius) / 1.7;
      }
      if (d < radius * 10) this.clipTo(aimedAstre);

      if (d < radius * 7) {
        mouseWheelSpeed = (d + radius) / 1.5;
        this.autoSpeed = mouseWheelSpeed;
        this.autoSpeedToggled = false;
      }

    } else {
      this.crossAirMaterial.color.set(0xffffff);
      this.autoSpeedToggled = false;
    }

    // MOUSE RAY
    this.cameraRaycaster.setFromCamera(this.mouse, this);
    this.mouseOvers = this.cameraRaycaster.intersectObjects(scene.children, true);

  }

}
