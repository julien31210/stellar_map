
const teleportTo = (o) => {

  const log = {
    a: `${o.uuid.slice(0, 4)}${o.name}`,
    t: o.type || o.constructor.name,
    pos: o.position,
    i: o.threeObjInited,
    parentp: o.orbit && o.orbit.parent && o.orbit.parent.position,
    o,
    r: o.radius
  };

  // teleportation start
  o.baseThreeObj.add(camera);
  camera.position.set(0, 0, o.radius * 7);
  camera.lookAt(o.baseThreeObj.position);
  // camera.position.set(o.position.x, o.position.y, o.position.z + o.radius * 6);
  const cp = new THREE.Vector3();
  camera.getWorldPosition(cp);
  speed = o.radius * 5;
  // teleportation end


  log.cp = cp;

  const opos = new THREE.Vector3();
  const universpos = new THREE.Vector3();
  o.baseThreeObj.getWorldPosition(opos);

  log.distance = opos.distanceTo(cp) / o.radius;
  log.distanceUniers = opos.distanceTo(universpos) / o.radius;

  const cp1 = new THREE.Vector3();
  camera.getWorldPosition(cp1);

  setTimeout(() => {

    const cp2 = new THREE.Vector3();
    camera.getWorldPosition(cp2);

    log.cpDiff = cp2.distanceTo(cp1);

    console.log(log);
  }, 250);

};
