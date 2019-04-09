const { URL } = require('url')
const POSTGRES = 'postgres'

const urlParser = dbUrl => {
  if (!dbUrl) return {}

  const { pathname, username, password, hostname: host, port } = new URL(dbUrl)

  return {
    username,
    password,
    host,
    port,
    database: pathname.substring(1),
    dialect: POSTGRES,
    protocol: POSTGRES
  }
}

module.exports = urlParser
