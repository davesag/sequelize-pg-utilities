const sleep = forHowLong =>
  new Promise(resolve => setTimeout(resolve, forHowLong))

module.exports = sleep
