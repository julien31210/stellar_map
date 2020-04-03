
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
  to: (strn, unit) => { // convert strn to the new unit (ex: convert.to('1M', 'B') return .001)
    // bring back to kilometers
    let nKm = toKm(strn);
    if (!unit) return nKm;
    if (unit.includes('parsec') || unit.includes('pc')) return nKm /= uv.parsecs;
    else if (unit.includes('meter')) return nKm /= uv.meter;
    else if (unit.includes('million')) return nKm /= uv.million;
    else if (unit.includes('B') || unit.includes('billion')) return nKm /= uv.billion;
    else if (unit.includes('ly') || unit.includes('LY')) return nKm /= uv.ly;
    else if (unit.includes('au') || unit.includes('AU')) return nKm /= uv.au;

    return nKm;
  }
};

const expoDisplay = (num) => {
  const n = num * 60 * 60;

  if(n < 1) return `${Math.floor(convert.to(n, 'mettre') * 100) / 100} mettre`;
  if(n >= 1
    && n < 1000000) return `${Math.floor(convert.to(n) * 100) / 100} km`;
  if(n >= 1000000
    && n < 1000000000) return `${Math.floor(convert.to(n, 'million') * 100) / 100} MillionKm`;
  if(n >= 1000000000
    && n < 9461000000000) return `${Math.floor(convert.to(n, 'billion') * 100) / 100} BillionKm`;
  if(n >= 9461000000000) return `${Math.floor(convert.to(n, 'LY') * 100) / 100} LY`;
  return n
}

// console.log(expoDisplay(.1512347875))
// console.log(expoDisplay(1.512347875))
// console.log(expoDisplay(12.512347875))
// console.log(expoDisplay(123.512347875))
// console.log(expoDisplay(1234.51258765425))
// console.log(expoDisplay(12341.51258765425))
// console.log(expoDisplay(123412.51258765425))
// console.log(expoDisplay(1234124.51258765425))
// console.log(expoDisplay(12341245.51258765425))
// console.log(expoDisplay(123456789.5124245))
// console.log(expoDisplay(12345678901.5124245))
// console.log(expoDisplay(123456789012.511122545))
// console.log(expoDisplay(1234567890123.511122545))
// console.log(expoDisplay(12345678901234.511122545))
// console.log(expoDisplay(123456789012345.511122545))
// console.log(expoDisplay(1234567890123456.511122545))
// console.log(expoDisplay(12345678901234567.511122545))
// console.log(expoDisplay(123456789012345678.511122545))
// console.log(expoDisplay(1234567890123456789.511122545))
// console.log(expoDisplay(12345678901234567890.511122545))

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

const angletruk = (dist, diametre) => Math.acos(dist / Math.sqrt(dist**2 + (diametre / 2)**2)) * (180 / Math.PI);
// console.log('soleil', angletruk(149597870, 1392700));
// console.log('piece2eur 277cm', angletruk(277, 2.575));
// console.log('piece2eur a 220-158', angletruk(220-158, 2.575));
// console.log('eau chaude a 220', angletruk(220, 8.5));
// console.log('piece5cents 1.70m', angletruk(170, 1.625));
// console.log('bille airsoft 6mm a 70cm', angletruk(70, .625));

// 6jkq4ze4y0g0 rose jaune a peine vert
// jvmbb8kak3k full orange
// 47bxlksdlxy0 rouge petite nebula
// kmnr3cn7e1s juste des etoiles
// 5uszihoblr80 bleu et rouge
// 70fdn9q7ka80 multicolore