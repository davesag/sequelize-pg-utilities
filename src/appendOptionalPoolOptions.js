const NAMES = [
  ['DB_POOL_ACQUIRE', 'acquire'],
  ['DB_POOL_EVICT', 'evict']
]

const appendOptionalPoolOptions = config => {
  console.log('config.pool', config.pool)

  const append = (acc, [e, n]) =>
    process.env[e] || config.pool[n]
      ? {
          ...acc,
          [n]: Number(process.env[e] || config.pool[n])
        }
      : acc

  return pool =>
    config.pool
      ? {
          ...pool,
          ...NAMES.reduce(append, config.pool)
        }
      : pool
}

module.exports = appendOptionalPoolOptions
