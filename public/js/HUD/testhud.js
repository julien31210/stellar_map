let width, height;

const initHUD = () => {

  sceneHUD.position.z = -200;
  camera.add(sceneHUD);
};

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

const strBreakLines = (str) => {
  const table = str.split(' ');
  let line = '';
  const lines = [];
  table.forEach((word, i) => {

    if (line.length + word.length > 20) {
      lines.push(line);
      line = '';
    }

    if (word.length > 20) lines.push(word);
    else line = `${line}${word} `;

  });

  if (line.length > 0) lines.push(line);

  return lines;

};
const openWindow = (clickEl) => {
  const { type, name, radius, mass } = clickEl;
  ctx.font = '20px Arial';
  ctx.fillStyle = '#C46210';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#2E5894';
  ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  console.log(`${type}, ${name}, ${radius}, ${mass}`);
  const lines = strBreakLines(`${type}, ${name}, ${radius}, ${mass}`);
  lines.forEach((t, i) => {
    ctx.fillText(t, canvas.width / 2, 20 + 20 * i);
  });

  const hudTexture = new THREE.Texture(canvas);
  hudTexture.needsUpdate = true;
  const material = new THREE.MeshBasicMaterial({ map: hudTexture });
  const planeGeometry = new THREE.PlaneGeometry(50, 50);
  const plane = new THREE.Mesh(planeGeometry, material);
  plane.position.x = -80;
  plane.position.y = 30;
  sceneHUD.add(plane);
};
