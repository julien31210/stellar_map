

const dimentionsDivider = 10000;

const sunlight = ({ color, intensity, colorlight, scope, radius }) => {

  const geometry = new THREE.SphereGeometry(radius + 2, (radius / 20) + 50, (radius / 20) + 50);
  const material = new THREE.MeshBasicMaterial({
    color,
  });
  const sollar = new THREE.Mesh(geometry, material);

  const light = new THREE.PointLight(colorlight, intensity, scope);

  return sollar.add(light);
};