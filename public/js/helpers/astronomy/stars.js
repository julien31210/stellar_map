
const starsTypes = {
  // whiteDwarf: args => ({
  //   type: 'whiteDwarf',
  //   radius: convert.to(6371) / 1000,
  //   density: 10 ** 9,
  //   color: 0xffffff,
  //   ...args
  // }),
  redDwarf: args => ({ // to do
    type: 'redDwarf',
    radius: convert.to(6371) / 1000,
    color: 0xf00f0f,
    mass: rand.on.n(1.49175 * (10 ** 29), 7.956 * (10 ** 29)),
    ...args
  }),
  // yellowDwarf: args => ({ // to do
  //   type: 'yellowDwarf',
  //   radius: convert.to(695508) / 1000,
  //   color: 0xf0f00f,
  //   density: 1410,
  //   ...args
  // }),
  brownDwarf: args => ({ // ok
    type: 'brownDwarf',
    radius: convert.to(69911 * rand.on.n(1.10, 1.15)) / 1000, // jupiter's radius + 10 to 15%
    mass: rand.on.n(2.5 * (10 ** 28), 1.5 * (10 ** 29)),
    color: 0xffaf38, // ok
    ...args
  }),
  sunLike: args => ({ // ok
    type: 'yellowDwarf',
    radius: convert.to(695508) / 1000,
    density: 1410,
    color: 0xf0f00f,
    mass: 1.989 * (10 ** 30),
    ...args
  })
};
