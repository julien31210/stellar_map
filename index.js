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
  camera.position.set(300, 400, 700);
  scene.add(camera);
  
  // on créé une sphere au quel on définie un matériau puis on l'ajoute à la scène
  const SphereGeometry1 = new THREE.SphereGeometry(100, 50, 50);
  const SphereMaterial1 = new THREE.MeshBasicMaterial({ color: 0xf0f00f, wireframe: true });
  mesh1 = new THREE.Mesh(SphereGeometry1, SphereMaterial1);
  scene.add(mesh1);
  console.log(mesh1.position);
  //on ajoute un point de pivot sur la première sphere
  pivotPoint = new THREE.Object3D();
  mesh1.add(pivotPoint);

// on créé une sphere au quel on définie un matériau puis on l'ajoute à la scène
  const SphereGeometry2 = new THREE.SphereGeometry (50, 20, 20);
  const SphereMaterial2 = new THREE.MeshBasicMaterial({ color: 0xfeeee, wireframe: true});
  mesh2 = new THREE.Mesh(SphereGeometry2, SphereMaterial2);

  //on donne une position à la seconde sphere 
  mesh2.position.set(260, 4, 6);

  // on ajoute un point de pivot à la seconde sphere
  pivotPoint.add(mesh2);
  
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
  
  // const SpherePosition = mesh1.position.set(100, 100, 100);
  // SpherePosition.position.set(10, 10, 10);
  
  camera.lookAt(scene.position);
  // on fait tourner la sphere sur ses axes x et y
  const time = Date.now()* 0.00;
  mesh1.position.x = Math.cos(time*10)*5;
  mesh1.position.y = Math.cos(time*7)*3;
  mesh1.position.z = Math.cos(time*8)*4;
  pivotPoint.rotation.y += 0.010;

  mesh1.rotation.x += 0.00;
  mesh1.rotation.y += 0.009;
  mesh2.rotation.x += 0.00;
  mesh2.rotation.y += 0.05;
  // on effectue le rendu de la scène
  renderer.render(scene, camera);
}

init();
animate();
