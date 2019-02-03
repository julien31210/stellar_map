const planetsTypes = {
  earthLike: args => ({
    name: `earth`,
    radius: convert.to(6371) / 1000,
    color: 0x00ffff,
    mass: 5.972 * (10 ** 24),
    moons: {
      nb: 1
    },
    ...args
  }),
  moonLike: args => ({
    radius: convert.to(3474) / 1000,
    color: 0xcccccc,
    mass: (7.36 * (10 ** 22)),
    ...args
  }),

  gastGiant: args => ({
    radius: convert.to(3474) / 1000,
    color: 0xcccccc,
    mass: (7.36 * (10 ** 22)),
    ...args
  }),
  telluric: args => ({
    radius: convert.to(3474) / 1000,
    color: 0xcccccc,
    mass: (7.36 * (10 ** 22)),
    ...args
  }),
};
