const range = (start, end, scl) => {
  const emp = (end - start);
  const r = [];
  if (emp > 0) {
    for (let i = start; i <= end; i += emp / scl) { r.push(i); }
  } else {
    console.log({ empscl: emp / scl, start, end, scl });
    for (let i = end; i <= start; i += -(emp / scl)) {
      console.log(emp - i);
      r.push(emp - i);
    }
  }
  return r;
};
