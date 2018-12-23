let renderer, scene, camera, lastRot;
const univers = [];
let speed = 250; // camera mouvement speed
const mouseSen = 2;
const keys = {};
let mousepressed = false;

const logger = {};

const dimentionsDivider = 10000;

onkeydown = onkeyup = (e) => {
  // console.log('e.keyCode', e.keyCode);
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
onmousewheel = (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (e.deltaY > 0) speed -= speed / 7;
  if (e.deltaY < 0) speed += speed / 7;
};

const sphere = (radius, color) => {
  const geometry = new THREE.SphereGeometry(radius, (radius / 20) + 10, (radius / 20) + 10);
  const material = new THREE.MeshBasicMaterial({
    color,
    wireframe: true
  });
  return new THREE.Mesh(geometry, material);
};

class Astre {
  constructor({ radius, color, type, mass, orbit }) {
    // DOC
    // orbit = {
    //   parent = orbital direct parent,
    //   distance = distance between parent and this astral object,
    // }

    this.mass = mass;
    this.type = type;
    this.radius = radius;
    this.color = color;
    this.orbitObj = orbit;

    this.init();

  }

  init() {

    if (this.orbitObj && this.orbitObj.parent && this.orbitObj.parent.mass && this.orbitObj.distance) {

      const orbitSpeed = (Math.sqrt(6.67 * (10 ** -11) * this.orbitObj.parent.mass / this.orbitObj.distance)) / dimentionsDivider;
      const orbitPeriod = Math.PI * 2 * this.orbitObj.distance / orbitSpeed;
      console.log('orbitSpeed', orbitSpeed);
      console.log('orbitPeriod', orbitPeriod);

      this.radiantPosition = range(Math.PI, -Math.PI, orbitPeriod * 30);
      // this.radiantsIndex = Math.floor(Math.random() * (this.radiantPosition.length - 1));
      this.radiantsIndex = Math.floor(this.radiantPosition.length * 0.64);
    }

    // this.logMySelf();
    this.initThreeObj();
  }

  logMySelf() {
    console.log(this);
  }

  initThreeObj() {
    const { radius, color } = this;
    this.threeObj = sphere(radius, color);

    scene.add(this.threeObj);
  }

  orbit(stellarParent) {
    this.orbitObj.parent = stellarParent;
  }

  animate() {
    if (this.orbitObj && this.orbitObj.parent && this.radiantsIndex) {
      const { radiantPosition, orbitObj: { parent, distance } } = this;

      // const a = new THREE.Vector3(parent.threeObj.position.x, parent.threeObj.position.y, parent.threeObj.position.z);
      // const b = new THREE.Vector3(this.threeObj.position.x, this.threeObj.position.y, this.threeObj.position.z);
      // const d = a.distanceTo(b);
      if (this.radiantsIndex > radiantPosition.length - 1) this.radiantsIndex = 0;

      this.threeObj.position.x = parent.threeObj.position.x + Math.cos(radiantPosition[this.radiantsIndex]) * distance;
      this.threeObj.position.z = parent.threeObj.position.z + Math.sin(radiantPosition[this.radiantsIndex]) * distance;
      this.threeObj.position.y = parent.threeObj.position.y + Math.sin(radiantPosition[this.radiantsIndex]) * -distance / 5;
      this.radiantsIndex += 1;
    }
  }
}


const createSollarSystem = (size) => { // eslint-disable-line
  const sun = new Astre({ radius: (69.57 * (10 ** 5)) / dimentionsDivider, color: 0xf0f00f, mass: (1.989 * (10 ** 30)) / dimentionsDivider, type: 'star' });
  univers.push(sun);

  const earth = new Astre({
    radius: 63710 / dimentionsDivider, // 10 times biger for perception
    color: 0x00ffff,
    type: 'planet',
    orbit: {
      parent: sun,
      distance: (149 * (10 ** 6)) / dimentionsDivider,
      speed: 10,
    },
    mass: (5.972 * (10 ** 24)) / dimentionsDivider
  });
  univers.push(earth);


  // moon mass 7.36 * (10 ** 2.2) kg for later
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
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000000);
  camera.position.set(0, 0, 700);
  scene.add(camera);

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

  frameCount += 1;

  Object.keys(keys).forEach((k) => {
    if (keys[k]) {
      if (k === global.controls.forward) camera.translateZ(-speed);
      if (k === global.controls.back) camera.translateZ(speed);
      if (k === global.controls.right) camera.translateX(speed);
      if (k === global.controls.left) camera.translateX(-speed);
      if (k === global.controls.up) camera.translateY(speed);
      if (k === global.controls.down) camera.translateY(-speed);
      if (k === global.controls.roll.left) camera.rotateZ(Math.PI / mouseSen / 75);
      if (k === global.controls.roll.right) camera.rotateZ(-Math.PI / mouseSen / 75);
      if (k === global.controls.logger) console.log(logger);

    }
    // remove key from object
  });
  // on appel la fonction animate() récursivement à chaque frame
  requestAnimationFrame(animate);

  // camera.lookAt(scene.position);

  const time = Date.now() * 0.005;

  univers.forEach((el) => {
    el.animate();
  });

  // on effectue le rendu de la scène
  renderer.render(scene, camera);
};

init();
animate();
