

const current_controls = controls.azerty;

let speed = 7000; // camera mouvement speed in km/s
let mousepressed = false;
let teleportIndex = '0';

let timeSpeedMultiplicator = 1;

onkeydown = onkeyup = (e) => {
  const k = e.keyCode;
  // console.log('e.keyCode', k);
  keys[k] = e.type === 'keydown';
  if (e.type === 'keydown') {
    if (k == current_controls.logger) console.log(logger);
    if (k == current_controls.timeSpeed.slowDown) timeSpeedMultiplicator > -500 ? timeSpeedMultiplicator -= Math.floor(Math.abs(timeSpeedMultiplicator) / 2) + .2 : null;
    if (k == current_controls.timeSpeed.speedUp) timeSpeedMultiplicator < 500 ? timeSpeedMultiplicator += Math.floor(Math.abs(timeSpeedMultiplicator) / 2) + .2 : null;
    if (k == current_controls.camera.speedUp) speed += speed / 2;
    if (k == current_controls.camera.slowDown) speed -= speed / 2;

    if (k == current_controls.camera.teleportToNextIndex && parseInt(teleportIndex, 10) + 1 <= univers.length) {
      teleportIndex = parseInt(teleportIndex, 10) + 1;
      if (univers[teleportIndex - 1]) teleportTo(univers[teleportIndex - 1]);
    }
    if (k == current_controls.camera.teleportToPrevIndex && teleportIndex - 1 > 0) {
      teleportIndex = parseInt(teleportIndex, 10) - 1;
      if (univers[teleportIndex - 1]) teleportTo(univers[teleportIndex - 1]);
    }

    if (k >= 48 && k <= 57) {
      const num = k - 48;
      teleportIndex += num.toString(10);
    }
    if (k === 13 && univers[teleportIndex - 1]) {
      const o = univers[teleportIndex - 1];
      teleportTo(o);
    }
    if (k === 8 || k === 13) teleportIndex = '0';
  }

};

onmousemove = (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  const newRot = { x: e.clientX, y: e.clientY };
  if (mousepressed) {
    const p = camera.rotation;
    // camera.rotation.set(p.x += (lastRot.y - newRot.y) / (250 / mouseSen), p.y += (lastRot.x - newRot.x) / (250 / mouseSen), p.z);
    camera.rotateX((lastRot.y - newRot.y) / (250 / mouseSen));
    camera.rotateY((lastRot.x - newRot.x) / (250 / mouseSen));
  }
  lastRot = newRot;
};

oncontextmenu = (e) => {
  e.preventDefault();
  mousepressed = false;
  if (mouseOvers.length) {
    cameraClipedTo = mouseOvers[0].object;

    univers.forEach((el) => {
      if (cameraClipedTo && (cameraClipedTo.uuid === el.uuid)) {
        openWindow(el.type);
      }
    });

    console.log(mouseOvers[0].object);
  }
};

onmousedown = (e) => {
  e.preventDefault();

  if (e.type !== 'contextmenu') {
    mousepressed = true;

  }
};
onmouseup = (e) => {
  mousepressed = false;
};
onmousewheel = (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (e.deltaY > 0) speed -= speed / 2;
  if (e.deltaY < 0) speed += speed / 2;
};
