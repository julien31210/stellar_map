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

  // on initialise la camera que l'on place ensuite sur la scène
  camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.001, convert.to('15parsecs') / 1000);
  scene.add(camera);

  const geometry = new THREE.BoxGeometry(.01, .01, .01);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const crossAir = new THREE.Object3D();
  // for (let i = 0; i < 4; i += 1) {
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(.02, 0, 0);
  const cube1 = new THREE.Mesh(geometry, material);
  cube1.position.set(-.02, 0, 0);
  const cube2 = new THREE.Mesh(geometry, material);
  cube2.position.set(0, .02, 0);
  const cube3 = new THREE.Mesh(geometry, material);
  cube3.position.set(0, -.02, 0);
  crossAir.add(cube, cube1, cube2, cube3);
  // }
  crossAir.position.set(0, 0, -5);
  camera.add(crossAir);

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

  Object.keys(keys).forEach((k) => {
    if (keys[k]) {
      if (k === current_controls.forward) camera.translateZ(-mouseWheelSpeed * delta);
      if (k === current_controls.back) camera.translateZ(mouseWheelSpeed * delta);
      if (k === current_controls.right) camera.translateX(mouseWheelSpeed * delta);
      if (k === current_controls.left) camera.translateX(-mouseWheelSpeed * delta);
      if (k === current_controls.up) camera.translateY(mouseWheelSpeed * delta);
      if (k === current_controls.down) camera.translateY(-mouseWheelSpeed * delta);
      if (k === current_controls.roll.left) camera.rotateZ((Math.PI / mouseSen / 7) * delta);
      if (k === current_controls.roll.right) camera.rotateZ(-(Math.PI / mouseSen / 7) * delta);
    }
  });

  cameraRaycaster.setFromCamera(mouse, camera);
  mouseOvers = cameraRaycaster.intersectObjects(scene.children, true);

  crossAirRaycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  crossAirOvers = crossAirRaycaster.intersectObjects(scene.children, true);
  if (crossAirOvers[0] && getAstreByUuid(crossAirOvers[0].object.uuid) && autoSpeedToggled) {

    const aimedAstre = getAstreByUuid(crossAirOvers[0].object.uuid);

    const d = aimedAstre.getDistanceToCamera(camera);
    const { radius } = aimedAstre;
    const newSpeed = (d ** 1.075) - (radius ** 1.1);

    mouseWheelSpeed = newSpeed;
    if (d < radius * 7) mouseWheelSpeed = d / 1.5;

  } else {
    autoSpeed = mouseWheelSpeed;
  }

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
    teleportTo(univers);
  }, 250);
})();
