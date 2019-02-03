
const sunlight = ({ color, intensity, colorlight, scope, radius }) => {

  const geometry = new THREE.SphereGeometry(radius, 25, 25);
  const material = new THREE.MeshBasicMaterial({ color });
  const star = new THREE.Mesh(geometry, material);

  const light = new THREE.PointLight(colorlight, intensity, scope);
  return { star, light };
};
