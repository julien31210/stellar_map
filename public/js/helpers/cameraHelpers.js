
const teleportTo = (o) => {
  o.threeObj.add(camera);
  camera.position.set(0, 0, o.radius * 6);
  camera.lookAt(o.threeObj.position);

};
