let renderer, scene, camera, lastRot, raycaster, mouse, cameraClipedTo;


let delta = 0;
const clock = new THREE.Clock();
const univers = [];

const baseTimeSpeed = 1; // how many seconds pass in one second

const mouseSen = 1;
const keys = {};
let mouseOvers = [];

const logger = {};

const init = () => {

  // on initialise le moteur de rendu
  renderer = new THREE.WebGLRenderer({ antialias: true });

  // si WebGL ne fonctionne pas sur votre navigateur on peut utiliser le moteur de rendu Canvas à la place
  // renderer = new THREE.CanvasRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('container').appendChild(renderer.domElement);

  // on initialise la scène
  scene = new THREE.Scene();

  // on initialise la camera que l'on place ensuite sur la scène
  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.001, toKm('15parsecs'));
  camera.position.set(0, 0, 700);
  scene.add(camera);

  // AmbientLight really low light
  const ambient = new THREE.AmbientLight(0x060606);
  scene.add(ambient);

  mouse = new THREE.Vector2();
  raycaster = new THREE.Raycaster();


  createSollarSystem(2);


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
      if (k === current_controls.forward) camera.translateZ(-speed * delta);
      if (k === current_controls.back) camera.translateZ(speed * delta);
      if (k === current_controls.right) camera.translateX(speed * delta);
      if (k === current_controls.left) camera.translateX(-speed * delta);
      if (k === current_controls.up) camera.translateY(speed * delta);
      if (k === current_controls.down) camera.translateY(-speed * delta);
      if (k === current_controls.roll.left) camera.rotateZ((Math.PI / mouseSen / 7) * delta);
      if (k === current_controls.roll.right) camera.rotateZ(-(Math.PI / mouseSen / 7) * delta);
    }
    // remove key from object
  });


  // on appel la fonction animate() récursivement à chaque frame
  requestAnimationFrame(animate);

  univers.forEach((el) => {
    let d = 0;
    if (timeSpeedMultiplicator !== 0) d = delta * baseTimeSpeed * timeSpeedMultiplicator;
    el.animate(d);
  });

  raycaster.setFromCamera(mouse, camera);
  mouseOvers = raycaster.intersectObjects(scene.children, true);

  // on effectue le rendu de la scène
  renderer.render(scene, camera);

  // logger
  logger.camPos = camera.position;
  logger.univers = univers;

};

init();
animate();
