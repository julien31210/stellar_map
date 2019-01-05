
const sunlight = ({ color, intensity, colorlight, scope, radius }) => {

  const geometry = new THREE.SphereGeometry(radius + 2, (radius / 200) + 50, (radius / 200) + 50);
  const material = new THREE.MeshBasicMaterial({
    color,
  });
  const sollar = new THREE.Mesh(geometry, material);

  const light = new THREE.PointLight(colorlight, intensity, scope);

  return sollar.add(light);
};
