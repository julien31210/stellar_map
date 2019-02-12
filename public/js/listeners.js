

const current_controls = controls.azerty;

let mouseWheelSpeed = 30000; // camera movement speed in km/s
let autoSpeedToggled = false;
let mousepressed = false;
let teleportIndex = '0';
cameraIndex = [];
let timeSpeedMultiplicator = 1;

const mouseIsLocked = () => document.pointerLockElement === document.getElementById('blocker');

const noPreventDefaultKeys = [116, 123, 27];

onkeydown = onkeyup = (e) => {
  const k = e.keyCode;
  // console.log('e.keyCode', k);
  keys[k] = e.type === 'keydown';

  if (!noPreventDefaultKeys.includes(k)) e.preventDefault();

  if (e.type === 'keydown') {
    if (k == current_controls.logger) console.log(logger);
    if (k == current_controls.timeSpeed.slowDown && timeSpeedMultiplicator > -5000000) timeSpeedMultiplicator -= Math.floor(Math.abs(timeSpeedMultiplicator) / 2) + .2;
    if (k == current_controls.timeSpeed.speedUp && timeSpeedMultiplicator < 5000000) timeSpeedMultiplicator += Math.floor(Math.abs(timeSpeedMultiplicator) / 2) + .2;
    if (k == current_controls.camera.speedUp) mouseWheelSpeed += mouseWheelSpeed / 2;
    if (k == current_controls.camera.slowDown) mouseWheelSpeed -= mouseWheelSpeed / 2;
    if (k == current_controls.camera.toggleAutoSpeed) autoSpeedToggled = !autoSpeedToggled;
    if (k == 13) {
      if (!mouseIsLocked()) {
        document.getElementById('blocker').requestPointerLock(); // lock the mouse
      } else document.exitPointerLock(); // unlock the mouse

    }
    if (k === 192) animate();

    if (k == current_controls.camera.teleportToNextIndex && parseInt(teleportIndex, 10) + 1 <= cameraIndex.length) {
      teleportIndex = parseInt(teleportIndex, 10) + 1;
      if (cameraIndex[teleportIndex - 1]) camera.teleportTo(cameraIndex[teleportIndex - 1]);
    }
    if (k == current_controls.camera.teleportToPrevIndex && teleportIndex - 1 > 0) {
      teleportIndex = parseInt(teleportIndex, 10) - 1;
      if (cameraIndex[teleportIndex - 1]) camera.teleportTo(cameraIndex[teleportIndex - 1]);
    }
  }
};

onmousemove = (e) => {
  if (camera.onMouseMove) camera.onMouseMove(e, mousepressed);

};

oncontextmenu = (e) => {
  e.preventDefault();

  if (camera.onContextMenu) camera.onContextMenu(e);

  if (!mouseIsLocked() && mouseOvers.length && getAstreByUuid(mouseOvers[0].object.uuid)) {
    console.log(getAstreByUuid(mouseOvers[0].object.uuid));
  }
};

onmousedown = (e) => {
  e.preventDefault();

  if (e.button === 0) { // if pressed button is left button
    mousepressed = true;

    if (!mouseIsLocked() && mouseOvers.length && getAstreByUuid(mouseOvers[0].object.uuid)) {
      console.log(getAstreByUuid(mouseOvers[0].object.uuid));
    }
  }
};
onmouseup = (e) => {
  if (e.button === 0) { // if released button is left button
    mousepressed = false;
  }
};
onmousewheel = (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (e.deltaY > 0) mouseWheelSpeed -= mouseWheelSpeed / 2;
  if (e.deltaY < 0) mouseWheelSpeed += mouseWheelSpeed / 2;
};
