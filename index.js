let renderer, scene, camera, mesh;


function init() {
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
  camera.position.set(0, 0, 1000);
  scene.add(camera);

  // on créé un cube au quel on définie un matériau puis on l'ajoute à la scène
  const geometry = new THREE.SphereGeometry(200, 30, 30);
  const material = new THREE.MeshBasicMaterial({ color: Oxff0000, wireframe: false });
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  // on ajoute une lumière blanche
  const lumiere = new THREE.DirectionalLight(0xffffff, 1.0);
  lumiere.position.set(0, 0, 400);
  scene.add(lumiere);

  // on effectue le rendu de la scène
  renderer.render(scene, camera);
}

function animate() {
  // on appel la fonction animate() récursivement à chaque frame
  requestAnimationFrame(animate);
  // on fait tourner le cube sur ses axes x et y
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;
  // on effectue le rendu de la scène
  renderer.render(scene, camera);
}

init();
animate();
