
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

const uv = { // units values
  parsecs: 3.086 * (10 ** 13),
  meter: .001,
  million: 10 ** 6,
  billion: 10 ** 9,
  ly: 9.461 * (10 ** 12),
  au: 150 * (10 ** 6)
};

const toKm = (n) => { // translate a string number like 15parsecs to kilometers
  // 15,3parsecs 78,35 M 1030 1.75m
  if (!n || Number.isInteger(n)) return n;
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

  if (str.includes('parsecs') || str.includes('pc')) r *= uv.parsecs;
  else if (str.includes('m') || str.includes('meter')) r *= uv.meter;
  else if (str.includes('M') || str.includes('million')) r *= uv.million;
  else if (str.includes('B') || str.includes('billion')) r *= uv.billion;
  else if (str.includes('ly') || str.includes('LY')) r *= uv.ly;
  else if (str.includes('au') || str.includes('AU')) r *= uv.au;

  return r;
};

const { PI, random, floor, round } = Math;

const dimentionDivider = 1000;
const convert = {
  radians: degrees => degrees * PI / 180,
  degrees: radians => radians * 180 / PI,
  to: (strn, unit) => {
    // bring back to kilometers
    let nKm = toKm(strn);
    if (!unit) return nKm;
    if (unit.includes('parsec') || unit.includes('pc')) nKm /= uv.parsecs;
    else if (unit.includes('m') || unit.includes('meter')) nKm /= uv.meter;
    else if (unit.includes('M') || unit.includes('million')) nKm /= uv.million;
    else if (unit.includes('B') || unit.includes('billion')) nKm /= uv.billion;
    else if (unit.includes('ly') || unit.includes('LY')) nKm /= uv.ly;
    else if (unit.includes('au') || unit.includes('AU')) nKm /= uv.au;

    return nKm;
  }
};

// return aproximately n more or less percentage
const aprox = (n, percentage) => {
  if (n && percentage) return rand.on.n(n - n * ((percentage || 0) / 100), n + n * ((percentage || 0) / 100));
  return n;
};

const rand = {
  on: {
    percent: chances => random() * 100 <= chances,
    n: (from, to) => (random() * (to - from)) + from,
    int: (from, to) => round(rand.on.n(from, to)),
    object: (obj) => {
      const arr = Object.keys(obj);
      return obj[rand.on.array(arr)];
    },
    array: (arr) => {
      const r = round(random() * (arr.length - 1));
      return arr[r];
    }
  },
  radiant: () => (random() * 2 - 1) * PI
};
