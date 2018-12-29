
const teleportTo = (o) => {
  console.log(o.threeObj);
  o.threeObj.add(camera);
  camera.position.set(0, o.radius * 20, o.radius * 20);
  camera.lookAt(o.threeObj.position);

};
