
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

const degrees = radians => radians * 180 / Math.PI;
const randOn100 = chances => Math.random() * 100 <= chances;
const randOnN = (from, to) => (Math.random() * (to - from)) + from;
const radiantRand = () => ((Math.random() * 2 - 1) * Math.PI) - Math.PI;

const aprox = (number, variation) => {

  const min = number - number / variation;
  const max = number + number / variation;

  return randOnN(min, max);
};

const randOnArray = (arr) => {
  const r = Math.round(Math.random() * (arr.length - 1));
  return arr[r];
};
