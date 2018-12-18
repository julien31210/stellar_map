let renderer, scene, camera, lastRot;
const univers = [];
const speed = 3; // 3 px per frame
const mouseSen = 2;

const keys = {};
let mousepressed = false;

onkeydown = onkeyup = (e) => {
  console.log(e.keyCode);
  keys[e.keyCode] = e.type === 'keydown';

};

onmousemove = (e) => {
  const newRot = { x: e.clientX, y: e.clientY };
  if (mousepressed) {
    const p = camera.rotation;
    // camera.rotation.set(p.x += (lastRot.y - newRot.y) / (250 / mouseSen), p.y += (lastRot.x - newRot.x) / (250 / mouseSen), p.z);
    camera.rotateX((lastRot.y - newRot.y) / (250 / mouseSen));
    camera.rotateY((lastRot.x - newRot.x) / (250 / mouseSen));
  }
  lastRot = newRot;
};

onmousedown = (e) => {
  mousepressed = true;
};
onmouseup = (e) => {
  mousepressed = false;
};

const sphere = (radius, color) => {
  const geometry = new THREE.SphereGeometry(radius, radius / 2, radius / 2);
  const material = new THREE.MeshBasicMaterial({ color, wireframe: true });
  return new THREE.Mesh(geometry, material);
};

const makePivot = (pivotObject, planete) => {
  console.log(pivotObject, planete);
  // create pivot object
  const pivot = new THREE.Object3D();
  pivotObject.add(pivot);

  // add planet to pivot
  pivot.add(planete);
  return pivot;
};

const createSollarSystem = (size) => {
  const sollarSystem = new THREE.Object3D();
  const sun = sphere(100, 0xf0f00f);
  univers.push({ threeObj: sun, rotate: { x: 0, y: 0.007, z: 0 } });
  sollarSystem.add(sun);
  if (size === 1) {
    return sollarSystem;
  }

  // on créé une sphere au quel on définie un matériau puis on l'ajoute à la scène
  const planet = sphere(50, 0x00ffff);
  univers.push({ threeObj: planet, rotate: { x: 0, y: 0.007, z: 0 } });
  // const pivotPoint = makePivot(sun, planet);
  // univers.push(pivotPoint);
  // on donne une position à la seconde sphere
  planet.position.set(0, 0, 0);
  sollarSystem.add(planet);
  return sollarSystem;
};

const init = () => {

  // on initialise le moteur de rendu
  renderer = new THREE.WebGLRenderer();

  // si WebGL ne fonctionne pas sur votre navigateur on peut utiliser le moteur de rendu Canvas à la place
  // renderer = new THREE.CanvasRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('container').appendChild(renderer.domElement);

  // on initialise la scène
  scene = new THREE.Scene();

  // on initialise la camera que l'on place ensuite sur la scène
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0, 0, 700);
  scene.add(camera);

  const sollarSystem = createSollarSystem(2);
  scene.add(sollarSystem);

  // on ajoute une lumière blanche
  const lumiere = new THREE.DirectionalLight(0xffffff, 1.0);
  lumiere.position.set(0, 0, 400);
  scene.add(lumiere);

  // on effectue le rendu de la scène
  renderer.render(scene, camera);
};

const longitude = range(Math.PI, -Math.PI, 1000);
let j = 0;
console.log(longitude);

const animate = () => {

  Object.keys(keys).forEach((k) => {
    if (keys[k]) {
      const p = camera.position;
      if (k === '90') camera.translateZ(-speed); // z
      if (k === '83') camera.translateZ(speed); // s
      if (k === '68') camera.translateX(speed); // d
      if (k === '81') camera.translateX(-speed); // q
      if (k === '32') camera.translateY(speed); // spacebarra
      if (k === '17') camera.translateY(-speed); // ctrl
    }
    // remove key from object
  });
  // on appel la fonction animate() récursivement à chaque frame
  requestAnimationFrame(animate);

  // const SpherePosition = mesh1.position.set(100, 100, 100);
  // SpherePosition.position.set(10, 10, 10);

  // camera.lookAt(scene.position);
  // on fait tourner la sphere sur ses axes x et y
  const time = Date.now() * 0.005;

  if (j >= longitude.length - 1) j = 0;

  univers[1].threeObj.position.x = Math.cos(longitude[j]) * 200;
  univers[1].threeObj.position.z = Math.sin(longitude[j]) * 200;
  univers[1].threeObj.position.y = Math.sin(longitude[j]) * -40;
  j += 1;
  // console.log(longitude[i]);
  // console.log('x', Math.cos(longitude[i]) * 5);
  // console.log('y', Math.sin(longitude[i]) * 5);
  // const { threeObj: { rotation }, rotate: { x: rx, y: ry, z: rz } } = univers[0];
  // const { x, y, z } = rotation;
  // rotation.set(x + rx, y + ry, z + rz);
  // pivotPoint.rotation.y += 0.09;
  // mesh1.rotation.x += 0.00;
  // mesh1.rotation.y += 0.00;
  // mesh1.position.x += 0.05;
  // mesh2.rotation.x += 0.00;
  // mesh2.rotation.y += 0.00;
  // on effectue le rendu de la scène
  renderer.render(scene, camera);
};

init();
animate();
