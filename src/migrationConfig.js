const configure = ({
  user: username,
  password,
  database,
  env,
  ...options
}) => ({ [env]: { username, password, database, ...options } })

module.exports = configure
