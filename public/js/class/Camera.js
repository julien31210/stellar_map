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
    this.menuMouseOvers = [];

    this.mouse = new THREE.Vector2();
    this.mousePressed = false;

    this.teleportIndex = 0;

    this.astralIconsHud = [];
  }

  teleportTo(obj, inside) {

    this.clipTo(obj); // add this to object

    this.position.set(0, 0, inside ? obj.radius - (obj.radius/100) : obj.radius * 7);
    this.lookAt(obj.position);

    mouseWheelSpeed = inside ? obj.radius/2 : obj.radius * 5;

  }

  clipTo(obj) {

    if (this.clipedTo && obj && this.clipedTo.uuid === obj.uuid) return;

    this.clipedTo = obj;

    this.matrix.copy(this.matrixWorld);
    this.applyMatrix(new THREE.Matrix4().getInverse(obj.matrixWorld));
    obj.add(this);

    // Add system we cliped to the hud
    this.updateAstralIcons(obj);
  }

  unClip() {
    if (this.clipedTo) {
      this.applyMatrix(this.clipedTo.matrixWorld);
      this.clipedTo.remove(this);
      scene.add(this);

      // Clip to the orbital parent of the object we unclip
      if (this.clipedTo.orbit && this.clipedTo.orbit.parent) this.clipTo(this.clipedTo.orbit.parent);
      else this.clipedTo = false;
    }
  }

  quickRepeatListeners(k) {

    if (k === current_controls.forward) {
      if (!this.autoSpeedToggled) this.translateZ(-mouseWheelSpeed * delta);
      else this.translateZ(-this.autoSpeed * delta);
    }
    if (k === current_controls.back && !this.autoSpeedToggled) this.translateZ(mouseWheelSpeed * delta);
    if (k === current_controls.right && !this.autoSpeedToggled) this.translateX((mouseWheelSpeed / 2) * delta);
    if (k === current_controls.left && !this.autoSpeedToggled) this.translateX((-mouseWheelSpeed / 2) * delta);
    if (k === current_controls.up && !this.autoSpeedToggled) this.translateY((mouseWheelSpeed / 2) * delta);
    if (k === current_controls.down && !this.autoSpeedToggled) this.translateY((-mouseWheelSpeed / 2) * delta);

    if (k === current_controls.roll.left) this.rotateZ((Math.PI / this.mouseSen / 7) * delta);
    if (k === current_controls.roll.right) this.rotateZ(-(Math.PI / this.mouseSen / 7) * delta);
  }

  normalListeners(k) {

    if (k == current_controls.camera.speedUp) mouseWheelSpeed += mouseWheelSpeed / 2;
    if (k == current_controls.camera.slowDown) mouseWheelSpeed -= mouseWheelSpeed / 2;
    if (k == current_controls.camera.toggleAutoSpeed) this.autoSpeedToggled = !this.autoSpeedToggled;
    if (k === 8) this.resetAstralIcons();
    if (k == 13) {
      if (!this.isLocked) {
        document.getElementById('blocker').requestPointerLock(); // lock the mouse
      } else document.exitPointerLock(); // unlock the mouse
    }

    if (k == current_controls.camera.teleportToNextIndex) {
      const nextIndex = parseInt(this.teleportIndex, 10) + 1;
      if(nextIndex <= cameraIndex.length){
        this.teleportIndex += 1;
        if(cameraIndex[this.teleportIndex] && cameraIndex[this.teleportIndex].position.x !== 'NaN') this.teleportTo(cameraIndex[this.teleportIndex]);
      } else if (nextIndex > cameraIndex.length) {
        this.teleportIndex = 0;
        if(cameraIndex[this.teleportIndex] && cameraIndex[this.teleportIndex].position.x !== 'NaN') this.teleportTo(cameraIndex[this.teleportIndex]);
      }
    }
    if (k == current_controls.camera.teleportToPrevIndex) {
      const nextIndex = parseInt(this.teleportIndex, 10) - 1;
      if(nextIndex >= 0){
        this.teleportIndex -= 1;
        if(cameraIndex[this.teleportIndex] && cameraIndex[this.teleportIndex].position.x !== 'NaN') this.teleportTo(cameraIndex[this.teleportIndex]);
      } else if (nextIndex < 0) {
        this.teleportIndex = cameraIndex.length;
        if(cameraIndex[this.teleportIndex] && cameraIndex[this.teleportIndex].position.x !== 'NaN') this.teleportTo(cameraIndex[this.teleportIndex]);
      }
    }
  }

  onMouseDown(e) {
    if (e.button === 0) { // if pressed button is left button
      this.mousePressed = true;

      if (
        !this.isLocked
        && this.mouseOvers.length
        && this.mouseOvers[0].object
        && this.mouseOvers[0].object.parent
      ) console.log(this.mouseOvers[0].object.parent);
    }
  }

  onContextMenu(e) {

    if (
      !this.isLocked
      && this.mouseOvers.length
      && this.mouseOvers[0].object
      && this.mouseOvers[0].object.parent
      && this.mouseOvers[0].object.parent.isAstre
    ) {
      const window = openWindow(this.mouseOvers[0].object.parent);
      sceneHUD.add(window);
    }

    if (this.menuMouseOvers[0]) {
      console.log(this.menuMouseOvers[0].object);
      sceneHUD.remove(this.menuMouseOvers[0].object);
    }
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


    this.crossAir.position.set(0, 0, -3);

    this.crossAirRotationCenter.add(this.crossAir);

    this.speedDisplay = openVarDisplayer({ width: 256, height: 256, offsety: -1, offsetz: -3, text: '' })

    this.crossAir.add(this.speedDisplay);

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

  updateAstralIcons(astre) {
    this.resetAstralIcons();

    if (astre && astre.isAstre) {

      if (!astre.iconInited) astre.initIcon();
      if (astre.icon && !this.children.includes(astre.icon)) {
        this.add(astre.icon);
        this.astralIconsHud.push(astre.icon);
      }

      // if the icon has an orbital parent
      if (astre.orbit && astre.orbit.parent) {
        // if parent icon is not inited
        if (!astre.orbit.parent.iconInited) astre.orbit.parent.initIcon();
        // if parent as icon and icon is not already in camera hud
        if(astre.orbit.parent.icon && !this.children.find(el => el.uuid === astre.orbit.parent.icon.uuid)) {
          // add it to camera hud and to AstralIcons 
          this.add(astre.orbit.parent.icon)
          this.astralIconsHud.push(astre.orbit.parent.icon);
        };
      }

      // display all first child's icons of this astre
      astre.childs.forEach((child) => {
        if (!child.iconInited) child.initIcon();
        if (child.icon && !this.children.includes(child.icon)) {
          this.add(child.icon);
          this.astralIconsHud.push(child.icon);
        }
      });
    }
  }

  resetAstralIcons() {
    // console.log(' -- resetAstralIcons --');
    // console.log(this.astralIconsHud)
    const removeIconRecurs = (o) => {
      // console.log(o.uuid.slice(0, 4), o.isIcon);
      if (o.isIcon) this.remove(o);

      if (o.children.length > 0) {
        o.children.forEach((children) => {
          removeIconRecurs(children);
        });
      }
    };

    this.astralIconsHud.forEach((icon) => {
      // if (icon.isIcon) icon.changeColor(0x00f9ff);
      // console.log(icon, icon.constructor.name)
      if (icon.isIcon) {
        // console.log(icon.astre.constructor.name, icon.uuid.slice(0, 4));
        removeIconRecurs(icon);
      }
    });
    this.astralIconsHud = []
  }

  animate(delta) {

    updateVarDisplayer({
      displayer: this.speedDisplay,
      width: 256, height: 256,
      text: `${expoDisplay(this.autoSpeedToggled ? this.autoSpeed : mouseWheelSpeed)}/h`
    });

    this.isLocked = document.pointerLockElement === document.getElementById('blocker');
    const cliped = this.clipedTo;
    if (cliped && cliped.radius * 10 < cliped.getDistanceTo(this)) this.unClip();

    // Get world quaternion of the crossAir
    const crossAirWorldQ = new THREE.Quaternion();
    this.crossAirRotationCenter.getWorldQuaternion(crossAirWorldQ);
    crossAirWorldQ.normalize();

    // RAYCASTERS
    // CROSS AIR RAYCASTER
    const crossAirRaycaster = new THREE.Raycaster();

    // get crossAir world
    const v = new THREE.Vector3();
    this.crossAir.getWorldPosition(v);

    const cp = new THREE.Vector3();
    this.getWorldPosition(cp);

    const dir = new THREE.Vector3();
    dir.subVectors(v, cp).normalize();

    crossAirRaycaster.set(cp, dir);

    const crossAirIntersect = crossAirRaycaster.intersectObjects(scene.children, true);

    const aimedAstres = crossAirIntersect.reduce((acc, aim) => {
      if (aim.object.isAstre) acc.push(aim.object);
      else if (aim.object.parent && aim.object.parent.isAstre) acc.push(aim.object.parent);
      else if (aim.object.parent && aim.object.parent.parent && aim.object.parent.parent.isAstre) acc.push(aim.object.parent);
      return acc;
    }, []);

    const aimed = aimedAstres[0];
    if (aimed) {
      const d = aimed.getDistanceTo(this);
      const { radius } = aimed;
      // '"Le Saut Quantique", omelette du fromage'
      if (this.autoSpeedToggled) {
        this.crossAirMaterial.color.set(0x0000ff);
        const newSpeed = ((d + radius) ** 1.075);
        this.autoSpeed = newSpeed;
      } else this.crossAirMaterial.color.set(0x00ff00);

      if (d > radius) {
        if (d < mouseWheelSpeed / 2 && !this.autoSpeedToggled) {
          mouseWheelSpeed = (d + radius) / 1.7;
        }

        if (d < radius * 7 && d > radius) {
          mouseWheelSpeed = (d + radius) / 1.5;
          this.autoSpeed = mouseWheelSpeed;
          this.autoSpeedToggled = false;
        }
      }

      if (d < radius * 10) this.clipTo(aimed);

    } else {
      this.crossAirMaterial.color.set(0xffffff);
      this.autoSpeedToggled = false;
    }

    // "Le Saut Quantique"'S AIM HELPER
    const aimedIcons = crossAirIntersect.reduce((acc, aim) => {
      const alreadyIn = (o) => acc.find((e) => e.uuid === o.uuid);

      if (aim.object.isIcon && !alreadyIn(aim.object)) acc.push(aim.object)
      else if (aim.object.parent && aim.object.parent.isIcon && !alreadyIn(aim.object.parent)) acc.push(aim.object.parent);
      else if (aim.object.parent && aim.object.parent.parent && aim.object.parent.parent.isIcon && !alreadyIn(aim.object.parent.parent)) {
        acc.push(aim.object.parent.parent);
      }
 
      return acc;
    }, []);

    aimedIcons.sort((a, b)=> a.astre.getDistanceTo(this) - b.astre.getDistanceTo(this));
    // take the closest astre
    const aimedIcon = aimedIcons[0] && aimedIcons[0];
    if (
      // !aimed &&
      aimedIcon
      && aimedIcon.astre
      && aimedIcon.astre.uuid !== this.clipedTo.uuid
      && this.previousAimedIconId
      && this.previousAimedIconId === aimedIcon.uuid
    ) {
      // console.log(aimedIcon.astre.uuid, this.clipedTo.uuid);
      const iconAstrePos = new THREE.Vector3();
      aimedIcon.astre.getWorldPosition(iconAstrePos); // get position of the aimed astre
      this.worldToLocal(iconAstrePos); // transform position of the aimed astre to local (local to camera)

      const q1 = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, -1), iconAstrePos.normalize());
      // get the rotation needed to look (perfectly) in the astre direction

      aimedIcon.astre.manageVisibility(this, true);
      this.crossAirRotationCenter.quaternion.slerp(q1, 0.5);
    }
    this.previousAimedIconId = aimedIcon && aimedIcon.uuid

    // FLEXIBLE CROSS AIR
    if (this.isLocked) {
      // Calculate how mutch strenght we want in flexibillity between crossair and camera
      let strenght = 7.5 * delta;
      strenght = strenght >= 1 ? 1 : strenght;

      // Bring quaternion of the crossAir in direction of the center of the screen (0, 0, 0)
      const center = new THREE.Quaternion(0, 0, 0, 1);
      this.crossAirRotationCenter.quaternion.slerp(center, strenght);

      // Bring camera quaternion in direction of the world quaternion of the crossAir
      this.quaternion.slerp(crossAirWorldQ, strenght);
    }

    // this.crossAirRotationCenter.quaternion.slerp()

    // MOUSE RAY
    this.cameraRaycaster.setFromCamera(this.mouse, this);
    this.mouseOvers = this.cameraRaycaster.intersectObjects(scene.children, true);
    this.menuMouseOvers = this.cameraRaycaster.intersectObjects(sceneHUD.children, true);

    // HUD
    // DISPLAY SYS (addToAstralIcons) rendering
    this.astralIconsHud.forEach((icon) => {

      if (!icon.isIcon) return;
      // Get astre's world position
      const astredPos = new THREE.Vector3();
      icon.astre.getWorldPosition(astredPos);
      // transform position to camera local
      this.worldToLocal(astredPos);
      // set the vector's length
      astredPos.setLength(60);
      icon.position.set(astredPos.x, astredPos.y, astredPos.z);
    });

  }

}
