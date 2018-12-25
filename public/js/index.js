let renderer, scene, camera, lastRot, raycaster, mouse, cameraClipedTo;

const current_controls = controls.azerty;

let delta = 0;
const clock = new THREE.Clock();
const univers = [];
const baseTimeSpeed = .1;
let speedUp = 1;

let speed = 250; // camera mouvement speed
const mouseSen = 1;
const keys = {};
let mousepressed = false;
let mouseOvers = [];

const logger = {};

onkeydown = onkeyup = (e) => {
  console.log('e.keyCode', e.keyCode);
  keys[e.keyCode] = e.type === 'keydown';
  if (e.type === 'keydown') {
    if (e.keyCode == current_controls.logger) console.log(logger);
    if (e.keyCode == current_controls.timeSpeed.slowDown) speedUp > -20 ? speedUp -= 1 : null;
    if (e.keyCode == current_controls.timeSpeed.speedUp) speedUp < 20 ? speedUp += 1 : null;
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
        el.threeObj.add(camera);
        // raycaster.setFromCamera(mouse, camera);
      }
    });

    console.log(mouseOvers[0].object);
  }
};

onmousedown = (e) => {
  e.preventDefault();

  console.log(e.type);

  if (e.type !== 'contextmenu') {
    mousepressed = true;

  }
};
onmouseup = (e) => {
  console.log(e.type);
  mousepressed = false;
};
onmousewheel = (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (e.deltaY > 0) speed -= speed / 2;
  if (e.deltaY < 0) speed += speed / 2;
};


const init = () => {

  // on initialise le moteur de rendu
  renderer = new THREE.WebGLRenderer({ antialias: true });

  // si WebGL ne fonctionne pas sur votre navigateur on peut utiliser le moteur de rendu Canvas à la place
  // renderer = new THREE.CanvasRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight + 10);
  document.getElementById('container').appendChild(renderer.domElement);

  // on initialise la scène
  scene = new THREE.Scene();

  // on initialise la camera que l'on place ensuite sur la scène
  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.001, 100000000);
  camera.position.set(0, 0, 700);
  scene.add(camera);


  mouse = new THREE.Vector2();
  raycaster = new THREE.Raycaster();


  createSollarSystem(2);

  // on ajoute une lumière blanche
  const lumiere = new THREE.DirectionalLight(0xffffff, 1.0);
  lumiere.position.set(0, 0, 400);
  scene.add(lumiere);

  // on effectue le rendu de la scène
  renderer.render(scene, camera);
};

let frameCount = 0;
setInterval(() => {
  console.log('frameCount', frameCount);
  frameCount = 0;
}, 1000);

const animate = () => {
  delta = clock.getDelta();

  frameCount += 1;

  Object.keys(keys).forEach((k) => {
    if (keys[k]) {
      if (k === current_controls.forward) camera.translateZ(-speed);
      if (k === current_controls.back) camera.translateZ(speed);
      if (k === current_controls.right) camera.translateX(speed);
      if (k === current_controls.left) camera.translateX(-speed);
      if (k === current_controls.up) camera.translateY(speed);
      if (k === current_controls.down) camera.translateY(-speed);
      if (k === current_controls.roll.left) camera.rotateZ(Math.PI / mouseSen / 75);
      if (k === current_controls.roll.right) camera.rotateZ(-Math.PI / mouseSen / 75);
    }
    // remove key from object
  });


  // on appel la fonction animate() récursivement à chaque frame
  requestAnimationFrame(animate);

  univers.forEach((el) => {
    let d = 0;
    if (speedUp !== 0) d = delta / speedUp;
    el.animate(d);
  });

  raycaster.setFromCamera(mouse, camera);
  mouseOvers = raycaster.intersectObjects(scene.children);

  // on effectue le rendu de la scène
  renderer.render(scene, camera);

};

init();
animate();
