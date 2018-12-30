
const teleportTo = (o) => {
  o.threeObj.add(camera);
  camera.position.set(0, o.radius * 100, o.radius * 100);
  camera.lookAt(o.threeObj.position);

};
