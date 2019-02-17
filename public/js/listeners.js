

const current_controls = controls.azerty;

let mouseWheelSpeed = 30000; // camera movement speed in km/s
let autoSpeedToggled = false;
const cameraIndex = [];
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

    if (k === 192) animate();
    camera.normalListeners(k);
  }
};

onmousemove = (e) => {
  if (camera && camera.onMouseMove) camera.onMouseMove(e);

};

oncontextmenu = (e) => {
  e.preventDefault();

  if (camera && camera.onContextMenu) camera.onContextMenu(e);
};

onmousedown = (e) => {
  e.preventDefault();

  if (camera && camera.onContextMenu) camera.onMouseDown(e);
};
onmouseup = (e) => {
  if (camera && camera.onContextMenu) camera.onMouseUp(e);
};
onmousewheel = (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (e.deltaY > 0) mouseWheelSpeed -= mouseWheelSpeed / 2;
  if (e.deltaY < 0) mouseWheelSpeed += mouseWheelSpeed / 2;
};
