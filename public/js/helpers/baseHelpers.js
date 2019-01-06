
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
const aprox = (n, percentage) => {
  if (n && percentage) return randOnN(n - n * ((percentage || 0) / 100), n + n * ((percentage || 0) / 100));
  return n;
};

const randOnArray = (arr) => {
  const r = Math.round(Math.random() * (arr.length - 1));
  return arr[r];
};

const dimentionDivider = 1000;
// NUMBERS
const toKm = (n) => { // translate a string number like 15parsecs to kilometers
  // 15,3parsecs 78,35 M 1030 1.75m
  if (!n || Number.isInteger(n)) return n / dimentionDivider;
  const str = n.toString();
  let r = str;
  if (str.includes(',')) {
    const nums = str.split(/[,|.]/);
    const unity = nums[0];
    const decimales = parseInt(nums[1], 10) / (10 ** parseInt(nums[1], 10).toString().length);

    r = parseInt(unity, 10) + decimales;
  } else {
    r = parseFloat(str, 10);
  }

  if (str.includes('parsecs') || str.includes('pc')) r *= 3.086 * (10 ** 13);
  else if (str.includes('m') || str.includes('meter')) r /= 1000;
  else if (str.includes('M') || str.includes('million')) r *= 10 ** 6;
  else if (str.includes('B') || str.includes('billion')) r *= 3.086 * (10 ** 13); // 9 461 B
  else if (str.includes('ly') || str.includes('LY')) r *= 3.086 * (10 ** 13); // 9 461 B
  else if (str.includes('au') || str.includes('AU')) r *= 150 * (10 ** 6);

  return r / dimentionDivider;
};
