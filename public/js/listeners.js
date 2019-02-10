

const current_controls = controls.azerty;

let mouseWheelSpeed = 30000; // camera movement speed in km/s
let autoSpeedToggled = false;
let mousepressed = false;
let teleportIndex = '0';
cameraIndex = [];
let timeSpeedMultiplicator = 1;

onkeydown = onkeyup = (e) => {
  const k = e.keyCode;
  // console.log('e.keyCode', k);
  keys[k] = e.type === 'keydown';
  if (e.type === 'keydown') {
    if (k == current_controls.logger) console.log(logger);
    if (k == current_controls.timeSpeed.slowDown && timeSpeedMultiplicator > -5000000) timeSpeedMultiplicator -= Math.floor(Math.abs(timeSpeedMultiplicator) / 2) + .2;
    if (k == current_controls.timeSpeed.speedUp && timeSpeedMultiplicator < 5000000) timeSpeedMultiplicator += Math.floor(Math.abs(timeSpeedMultiplicator) / 2) + .2;
    if (k == current_controls.camera.speedUp) mouseWheelSpeed += mouseWheelSpeed / 2;
    if (k == current_controls.camera.slowDown) mouseWheelSpeed -= mouseWheelSpeed / 2;
    if (k == current_controls.camera.toggleAutoSpeed) autoSpeedToggled = !autoSpeedToggled;
    if (k == 13) {
      if (document.pointerLockElement === document.getElementById('blocker')) document.exitPointerLock();
      else document.getElementById('blocker').requestPointerLock();
    }
    if (k === 192) animate();

    if (k == current_controls.camera.teleportToNextIndex && parseInt(teleportIndex, 10) + 1 <= cameraIndex.length) {
      teleportIndex = parseInt(teleportIndex, 10) + 1;
      if (cameraIndex[teleportIndex - 1]) teleportTo(cameraIndex[teleportIndex - 1]);
    }
    if (k == current_controls.camera.teleportToPrevIndex && teleportIndex - 1 > 0) {
      teleportIndex = parseInt(teleportIndex, 10) - 1;
      if (cameraIndex[teleportIndex - 1]) teleportTo(cameraIndex[teleportIndex - 1]);
    }
  }

};

onmousemove = (e) => {

  const isLocked = document.pointerLockElement === document.getElementById('blocker');

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  const newRot = { x: e.clientX, y: e.clientY };
  if (mousepressed && !isLocked) {
    const p = camera.rotation;
    // camera.rotation.set(p.x += (lastRot.y - newRot.y) / (250 / mouseSen), p.y += (lastRot.x - newRot.x) / (250 / mouseSen), p.z);
    camera.rotateX((lastRot.y - newRot.y) / (250 / mouseSen));
    camera.rotateY((lastRot.x - newRot.x) / (250 / mouseSen));
  }
  lastRot = newRot;

  if (!isLocked) return;

  const movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
  const movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
  camera.rotateX(-movementY / (1000 / mouseSen));
  camera.rotateY(-movementX / (1000 / mouseSen));
};

oncontextmenu = (e) => {
  e.preventDefault();
  mousepressed = false;
  if (mouseOvers.length) {
    console.log(convert.to(mouseOvers[0].distance));

    cameraIndex.forEach((el) => {
      if (mouseOvers[0] && mouseOvers[0].uuid === el.uuid) {
        console.log(mouseOvers[0]);
        if (typeof mouseOvers[0].onRightClick === 'function') mouseOvers[0].onRightClick();
      }
    });

  }
};

onmousedown = (e) => {
  e.preventDefault();

  if (e.type !== 'contextmenu') {
    mousepressed = true;

    if (mouseOvers.length) {
      cameraIndex.forEach((el) => {
        if (mouseOvers[0] && mouseOvers[0].uuid === el.uuid) {
          console.log(mouseOvers[0]);
          if (typeof mouseOvers[0].onLeftClick === 'function') mouseOvers[0].onLeftClick();
        }
      });
    }
  }
};
onmouseup = (e) => {
  mousepressed = false;
};
onmousewheel = (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (e.deltaY > 0) mouseWheelSpeed -= mouseWheelSpeed / 2;
  if (e.deltaY < 0) mouseWheelSpeed += mouseWheelSpeed / 2;
};
