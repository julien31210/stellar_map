let renderer, scene, camera, lastRot, cameraRaycaster, crossAirRaycaster, crossAirOvers, mouse, cameraClipedTo, univers, controlsPointLocker, pointLockerRaycaster;


let delta = 0;
const clock = new THREE.Clock();

const baseTimeSpeed = .1; // how many thousands seconds pass in one second

const mouseSen = 1;
const keys = {};
let mouseOvers = [];

const fov = 65;

const logger = {
  time: { s: 0, m: 0, h: 0, j: 0, a: 0 }
};

const init = () => {

  // on initialise le moteur de rendu
  renderer = new THREE.WebGLRenderer({ antialias: true });

  // si WebGL ne fonctionne pas sur votre navigateur on peut utiliser le moteur de rendu Canvas à la place
  // renderer = new THREE.CanvasRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('container').appendChild(renderer.domElement);

  // on initialise la scène
  scene = new THREE.Scene();
  scene.updateMatrixWorld();

  // on initialise la camera avec la class camera qui wrap la camera de three avec quelques fonctionnalitees en plus
  camera = new Camera({ camera: { fov, screenRatio: window.innerWidth / window.innerHeight, minDistance: 0.001, maxDistance: convert.to('15parsecs') / 1000 } });

  // AmbientLight really low light
  const ambient = new THREE.AmbientLight(0x060606);
  scene.add(ambient);

  mouse = new THREE.Vector2();
  cameraRaycaster = new THREE.Raycaster();
  crossAirRaycaster = new THREE.Raycaster();


  // on effectue le rendu de la scène
  renderer.render(scene, camera);
};

let frameCount = 0;
setInterval(() => {
  logger.frameCount = frameCount;
  frameCount = 0;
}, 1000);

const animate = () => {
  delta = clock.getDelta();

  frameCount += 1;

  cameraRaycaster.setFromCamera(mouse, camera);
  mouseOvers = cameraRaycaster.intersectObjects(scene.children, true);

  crossAirRaycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  crossAirOvers = crossAirRaycaster.intersectObjects(scene.children, true);
  if (crossAirOvers[0] && getAstreByUuid(crossAirOvers[0].object.uuid) && autoSpeedToggled) {

    const aimedAstre = getAstreByUuid(crossAirOvers[0].object.uuid);

    const d = aimedAstre.getDistanceToCamera(camera);
    const { radius } = aimedAstre;
    const newSpeed = (d ** 1.075) - (radius ** 1.1);

    autoSpeed = newSpeed;
    if (d < radius * 7) {
      mouseWheelSpeed = d / 1.5;
      autoSpeed = mouseWheelSpeed;
    }

  } else {
    autoSpeedToggled = false;
  }

  Object.keys(keys).forEach((k) => {
    if (keys[k]) {

      if (k === current_controls.forward) {
        if (!autoSpeedToggled) camera.translateZ(-mouseWheelSpeed * delta)
        else camera.translateZ(-autoSpeed * delta);
      }
      if (k === current_controls.back) camera.translateZ(mouseWheelSpeed * delta);
      if (k === current_controls.right) camera.translateX(mouseWheelSpeed * delta);
      if (k === current_controls.left) camera.translateX(-mouseWheelSpeed * delta);
      if (k === current_controls.up) camera.translateY(mouseWheelSpeed * delta);
      if (k === current_controls.down) camera.translateY(-mouseWheelSpeed * delta);

      if (k === current_controls.roll.left) camera.rotateZ((Math.PI / mouseSen / 7) * delta);
      if (k === current_controls.roll.right) camera.rotateZ(-(Math.PI / mouseSen / 7) * delta);
    }
  });

  // on effectue le rendu de la scène
  renderer.render(scene, camera);
  // scene.updateMatrixWorld(); ??

  if (univers) univers.animate(delta, baseTimeSpeed * timeSpeedMultiplicator);
  // logger
  logger.camPos = camera.position;
  logger.univers = univers;
  logger.cameraSpeed = `${mouseWheelSpeed}Km/s`;
  logger.mouseOvers = mouseOvers;
  logger.time.s += delta * timeSpeedMultiplicator;
  logger.time.m = logger.time.s / 60;
  logger.time.h = logger.time.m / 60;
  logger.time.j = logger.time.h / 24;
  logger.time.a = logger.time.j / 365;


  // on appel la fonction animate() récursivement à chaque frame
  requestAnimationFrame(animate);
};

init();
(() => {

  const { int: rInt, n } = rand.on;
  univers = new Galaxy({
    name: `Galaxy${0 + 1}`,
    branchesNumber: rInt(2, 5),
    spiralStrength: n(1, 3),
    density: n(1.2, 2.2),
    sysNumber: 150
  });

  animate();
  setTimeout(() => {
    camera.teleportTo(univers);
  }, 250);
})();
