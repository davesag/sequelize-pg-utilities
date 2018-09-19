const url = require('url')

const POSTGRES = 'postgres'

const urlParser = dbUrl => {
  if (!dbUrl) return {}

  const dbURL = url.parse(dbUrl)
  const authArr = dbURL.auth.split(':')
  const hostArr = dbURL.host.split(':')

  return {
    database: dbURL.path.substring(1),
    username: authArr[0],
    password: authArr[1],
    host: hostArr[0],
    port: hostArr[1],
    dialect: POSTGRES,
    protocol: POSTGRES
  }
}

module.exports = urlParser
