
let renderer, scene, camera, univers, sceneHUD;

let delta = 0;
const clock = new THREE.Clock();

const baseTimeSpeed = .1; // how many thousands seconds pass in one second

const keys = {};

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
  sceneHUD = new THREE.Scene();

  scene.updateMatrixWorld();

  scene.background = new THREE.CubeTextureLoader()
	.setPath( 'textures/skybox/' )
	.load( [
		'right.png',
		'left.png',
		'top.png',
		'bottom.png',
		'front.png',
		'back.png'
	] );

  // on initialise la camera avec la class camera qui wrap la camera de three avec quelques fonctionnalitees en plus
  camera = new Camera({
    camera:
    {
      fov: 65,
      screenRatio: window.innerWidth / window.innerHeight, minDistance: 0.001,
      maxDistance: convert.to('15parsecs') / 1000
    },
    mouse: {
      mouseSen: 1
    }
  });

  // AmbientLight really low light
  const ambient = new THREE.AmbientLight(0x060606);
  scene.add(ambient);

  initHUD();

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

  if (camera) camera.animate(delta);

  if (mouseIsLocked()) {
    instructions.style.display = 'none';
    lockedInstructions.style.display = 'block';
  } else {
    instructions.style.display = 'block';
    lockedInstructions.style.display = 'none';
  }

  Object.keys(keys).forEach((k) => {
    if (keys[k]) {
      camera.quickRepeatListeners(k);
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
  logger.time.s += delta * timeSpeedMultiplicator;
  logger.time.m = Math.floor(logger.time.s / 60);
  logger.time.h = Math.floor(logger.time.m / 60);
  logger.time.j = Math.floor(logger.time.h / 24);
  logger.time.a = Math.floor(logger.time.j / 365);


  // on appel la fonction animate() récursivement à chaque frame
  requestAnimationFrame(animate);
};

init();
(() => { // document on ready

  console.log(current_controls);

  const newUl = () => document.createElement('ul');
  const newLi = () => document.createElement('li');

  const recursivObjectToHtml = (o, html) => {

    Object.keys(o)
      .forEach((key) => {
        if (typeof o[key] === 'object') {
          const li = newLi();
          const ul = newUl();
          li.appendChild(document.createTextNode(`${key}:`));
          li.appendChild(recursivObjectToHtml(o[key], ul));
          html.appendChild(li);
        } else {
          const li = newLi();
          li.appendChild(document.createTextNode(`${key}: ${keyCode(parseInt(o[key], 10)).toUpperCase()}`));

          html.appendChild(li);
        }
      });

    return html;
  };

  const controlsList = recursivObjectToHtml(current_controls, newUl());

  const instructions = document.getElementById('instructions');
  const lockedInstructions = document.getElementById('lockedInstructions');

  instructions.appendChild(controlsList);
  instructions.style.display = 'block';
  lockedInstructions.style.display = 'none';

  // String.fromCharCode(e.keyCode);

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
    camera.teleportTo(univers, true);
  }, 250);
})();
