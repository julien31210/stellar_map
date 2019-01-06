
const teleportTo = (o) => {
  o.threeObj.add(camera);
  camera.position.set(-o.radius * 6, 0, 0);
  camera.lookAt(o.threeObj.position);

};
