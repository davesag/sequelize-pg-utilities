const { Client } = require('pg')

const DEFAULT_ADMIN_DB = 'postgres'
const DUPLICATE_DATABASE = '42P04'

const createDb = async (options, name) => {
  const config = {
    database: DEFAULT_ADMIN_DB,
    ...options
  }

  return new Promise((resolve, reject) => {
    const client = new Client(config)
    client.on('drain', client.end.bind(client))
    client.on('error', reject)
    client.connect()

    const sql = `CREATE DATABASE "${name}"`
    return client
      .query(sql)
      .then(() => resolve(true))
      .catch(err => (err && err.code === DUPLICATE_DATABASE ? resolve(false) : reject(err)))
  })
}

module.exports = createDb
