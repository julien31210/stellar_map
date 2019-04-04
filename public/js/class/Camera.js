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

    this.easyFindHud = [];
    this.easyFindIconSize = .5;
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

    // Add system we cliped to the hud
    this.updateEasyfind(obj);
  }

  unClip() {
    if (this.clipedTo) {
      this.applyMatrix(this.clipedTo.groupThree.matrixWorld);
      this.clipedTo.groupThree.remove(this);
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
    if (k === 8) this.resetEasyfind();
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
    ) openWindow(getAstreByUuid(this.mouseOvers[0].object.uuid));

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

  updateEasyfind(astre) {
    this.resetEasyfind();

    if (astre && astre.isAstre) {


      const newCircle = (radius, quality) => {
        const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        const geometry = new THREE.Geometry();
        const r = radius || .25;
        const circleQuality = quality || 4;
        const tilt = Math.PI * .25; // 45 deg

        for (let i = 0; i <= circleQuality; i += 1) {
          const radPos = i * (Math.PI * 2 / circleQuality) + tilt;
          const x = r * Math.sin(radPos);
          const y = r * Math.cos(radPos);

          geometry.vertices.push(new THREE.Vector3(x, y, 0));
        }
        return new THREE.Line(geometry, material);
      };

      const newPoint = () => {
        const geo = new THREE.Geometry();
        const mat = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        geo.vertices.push(new THREE.Vector3(0, 0, 0));
        return new THREE.Points(geo, mat);
      };

      const icons = {
        Planet: () => newCircle(this.easyFindIconSize, 6),
        System: false, // no icons for systems
        BinaryStars: (binaryStars) => {
          const iconSize = this.easyFindIconSize * 1.5;
          const totalIconDistance = iconSize + .1;
          const totalVertices = 12;
          // Get real stars radius
          const realR1 = binaryStars.star1.radius;
          const realR2 = binaryStars.star2.radius;
          // Get real stars orbits distances
          const realDist1 = binaryStars.star1.orbit.distance;
          const realDist2 = binaryStars.star2.orbit.distance;
          // Totals
          const totalRealRadius = realR1 + realR2;
          const totalRealDistance = realDist1 + realDist2;

          // Icon stars radius
          const iconR1 = realR1 * iconSize / totalRealRadius;
          const iconR2 = realR2 * iconSize / totalRealRadius;

          // Icon stars distances from the middle of the icon
          const iconDist1 = realDist2 * totalIconDistance / totalRealDistance;
          const iconDist2 = realDist1 * totalIconDistance / totalRealDistance;

          // Icon stars distances from the middle of the icon (+ 2 to avoid to be at less than 3)
          const verticesNumber1 = Math.ceil(totalVertices * iconR1) + 2;
          const verticesNumber2 = Math.ceil(totalVertices * iconR2) + 2;

          const star1 = newCircle(iconR1, verticesNumber1);
          const star2 = newCircle(iconR2, verticesNumber2);

          star1.position.set(-iconDist1, 0, 0);
          star2.position.set(iconDist2, 0, 0);

          const bs = new THREE.Object3D();

          bs.add(star1, star2);

          return bs;
        }, // TO DO: use binary stars infos
        Galaxy: (galaxy) => {
          const iconSize = this.easyFindIconSize * 4;
          const { branchesNumber } = galaxy;
          // create icon taking into account its number of branches
          const sysNumberPerBranche = 10;

          const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
          const geometry = new THREE.Geometry();

          const lines = [];
          for (let j = 0; j < branchesNumber; j += 1) {
            const lineGeometry = new THREE.Geometry();

            for (let i = 0; i <= sysNumberPerBranche - 1; i += 1) {
              // Define radial position of the vertice
              const radPos = ((Math.PI * 2) / sysNumberPerBranche / branchesNumber)
                * (sysNumberPerBranche - i)
                + (Math.PI * 2 / branchesNumber)
                * j;

              const r = (iconSize / sysNumberPerBranche) * i // Define distance between sys
                + iconSize / 10; // Define distance between galactic center and sys

              // Position the vertices of the lines
              const linex = r * Math.sin(radPos);
              const liney = r * Math.cos(radPos);
              // Position the points with radial offset
              const pointx = r * Math.sin(radPos + Math.PI / branchesNumber / 5);
              const pointy = r * Math.cos(radPos + Math.PI / branchesNumber / 5);

              // Push the vertices
              geometry.vertices.push(new THREE.Vector3(pointx, pointy, 0));
              lineGeometry.vertices.push(new THREE.Vector3(linex, liney, 0));
            }
            lines.push(new THREE.Line(lineGeometry, material));
          }
          const points = new THREE.Points(geometry, material);

          const g = new THREE.Object3D();

          g.add(
            points,
            ...lines
          );

          // g.children[0].material.color.set(0x00f9ff); // To set color
          return g;
        },
        Star: () => newCircle(this.easyFindIconSize * 1.2, 8)
      };

      const findIcon = (a) => {
        if (!icons[a.constructor && a.constructor.name]) return false;
        const icontype = icons[a.constructor && a.constructor.name];

        return icontype(a);
      };


      // If the added astre is not already is the hud
      if (!this.easyFindHud.find(el => el.astre.uuid === astre.uuid)) {
        // We add it
        const icon = findIcon(astre);
        this.easyFindHud.push({ icon, astre });
        if (icon) this.add(icon);
      }
      if (astre.orbit && astre.orbit.parent && !this.easyFindHud.find(el => el.astre.uuid === astre.orbit.parent.uuid)) {
        // We add it
        const icon = findIcon(astre.orbit.parent);
        this.easyFindHud.push({ icon, astre: astre.orbit.parent });
        if (icon) this.add(icon);
      }

      astre.childs.forEach((entity) => {
        // If the added astre is not already is the hud
        if (this.easyFindHud.find(el => el.astre.uuid === entity.uuid)) return;
        // We add it
        const childIcon = findIcon(entity);
        this.easyFindHud.push({ icon: childIcon, astre: entity });

        if (childIcon) this.add(childIcon);

      });

    }
  }

  resetEasyfind() {
    this.easyFindHud.forEach((e) => { this.remove(e.icon); });
    this.easyFindHud = [];
  }

  getAstreByIconUuid(uuid) {
    // stop this shit pass icon in each astre !
    const a = this.easyFindHud.find(element => element.icon && element.icon.uuid === uuid);
    if (a) return a;

    return this.easyFindHud.find(element => element.icon
      && element.icon.children
      && element.icon.children.reduce((r, children) => {
        if (children.uuid === uuid) return true;
        return r;
      }, false));
  }

  animate(delta) {
    this.isLocked = document.pointerLockElement === document.getElementById('blocker');
    const cliped = this.clipedTo;
    if (cliped && cliped.radius * 10 < cliped.getDistanceTo(this)) this.unClip();

    // Get world quaternion of the crossAir
    const crossAirWorldQ = new THREE.Quaternion();
    this.crossAirRotationCenter.getWorldQuaternion(crossAirWorldQ);
    crossAirWorldQ.normalize();

    if (this.isLocked) {
      // Calculate how mutch strenght we want in flexibillity between crossair and camera
      let strenght = 7.5 * delta;
      strenght = strenght >= 1 ? 1 : strenght;

      // Bring camera quaternion in direction of the world quaternion of the crossAir
      this.quaternion.slerp(crossAirWorldQ, strenght);

      // Bring quaternion of the crossAir in direction of the center of the screen (0, 0, 0)
      const center = new THREE.Quaternion(0, 0, 0, 1);
      this.crossAirRotationCenter.quaternion.slerp(center, strenght);
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

    const aimed = crossAirIntersect.length > 0
      ? crossAirIntersect
        .reduce((r, el) => {
          let temp = { astres: [], icons: [] };
          if (r) temp = r;
          const uuid = el.object && el.object.uuid;

          const astre = getAstreByUuid(uuid);
          if (astre) temp.astres.push(astre);
          const icon = this.getAstreByIconUuid(uuid);
          if (icon) temp.icons.push(icon);
          if (temp.astres || temp.icons) return temp;
          return r;
        }, undefined)
      : undefined;

    if (aimed && aimed.astres && aimed.astres[0]) {

      const d = aimed.astres[0].getDistanceTo(this);
      const { radius } = aimed.astres[0];

      // '"Le Saut Quantique", omelette du fromage'
      if (this.autoSpeedToggled) {
        this.crossAirMaterial.color.set(0x0000ff);
        const newSpeed = ((d + radius) ** 1.075);
        this.autoSpeed = newSpeed;
      } else this.crossAirMaterial.color.set(0x00ff00);

      if (d < mouseWheelSpeed / 2 && !this.autoSpeedToggled) {
        mouseWheelSpeed = (d + radius) / 1.7;
      }
      if (d < radius * 10) this.clipTo(aimed.astres[0]);

      if (d < radius * 7) {
        mouseWheelSpeed = (d + radius) / 1.5;
        this.autoSpeed = mouseWheelSpeed;
        this.autoSpeedToggled = false;
      }

    } else {
      this.crossAirMaterial.color.set(0xffffff);
      this.autoSpeedToggled = false;
    }

    if (aimed && aimed.icons && aimed.icons[0]) {

      const uuid = aimed.icons && aimed.icons[0].uuid;
      const icon = this.getAstreByIconUuid(uuid);

      if (icon) {
        const iconAstrePos = new THREE.Vector3();
        icon.astre.getWorldPosition(iconAstrePos); // get position of the aimed astre
        this.worldToLocal(iconAstrePos); // transform position of the aimed astre to local (local to camera)

        const q1 = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, -1), iconAstrePos.normalize());
        // get the rotation needed to look (perfectly) in the astre direction

        this.crossAirRotationCenter.quaternion.slerp(q1, 0.1);
      }
    }

    // MOUSE RAY
    this.cameraRaycaster.setFromCamera(this.mouse, this);
    this.mouseOvers = this.cameraRaycaster.intersectObjects(scene.children, true);
    this.menuMouseOvers = this.cameraRaycaster.intersectObjects(sceneHUD.children, true);

    // HUD
    // DISPLAY SYS (updateEasyfind) rendering
    this.easyFindHud.forEach((el) => {

      if (!el.icon) return;

      // Get astre's world position
      const astredPos = new THREE.Vector3();
      el.astre.groupThree.getWorldPosition(astredPos);
      // transform position to camera local
      this.worldToLocal(astredPos);
      // set the vector's length
      astredPos.setLength(60);
      el.icon.position.set(astredPos.x, astredPos.y, astredPos.z);
    });

  }

}
