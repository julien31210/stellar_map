
const range = (start, end, scl) => {
  const emp = (end - start);
  const r = [];
  if (emp > 0) {
    for (let i = start; i <= end; i += emp / scl) { r.push(i); }
  } else {
    for (let i = end; i <= start; i += -(emp / scl)) {
      r.push(emp - i);
    }
  }
  return r;
};
const convert = {
  radians: degrees => degrees * Math.PI / 180,
  degrees: radians => radians * 180 / Math.PI
}
const randOn100 = chances => Math.random() * 100 <= chances;
const randOnN = (from, to) => (Math.random() * (to - from)) + from;
const radiantRand = () => (Math.random() * 2 - 1) * Math.PI;

// return aproximately return n more or less percentage
const aprox = (n, percentage) => randOnN(n - n * (percentage / 100), n + n * (percentage / 100));

const randOnArray = (arr) => {
  const r = Math.round(Math.random() * (arr.length - 1));
  return arr[r];
};
