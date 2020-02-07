const NAMES = [
  ['DB_POOL_ACQUIRE', 'acquire'],
  ['DB_POOL_EVICT', 'evict']
]

const appendOptionalPoolOptions = (config, also = {}) => {
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
          ...also,
          ...NAMES.reduce(append, config.pool)
        }
      : { ...pool, ...also }
}

module.exports = appendOptionalPoolOptions
