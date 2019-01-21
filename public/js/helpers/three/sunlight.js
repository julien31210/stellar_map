
const sunlight = ({ color, intensity, colorlight, scope, radius }) => {

  const geometry = new THREE.SphereGeometry(radius, 50, 50);
  const material = new THREE.MeshBasicMaterial({ color });
  const star = new THREE.Mesh(geometry, material);

  const light = new THREE.PointLight(colorlight, intensity, scope);
  return { star, light };
};
