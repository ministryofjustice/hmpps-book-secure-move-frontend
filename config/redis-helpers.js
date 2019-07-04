const buildRedisUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return `redis://:${process.env.REDIS_AUTH_TOKEN}@${process.env.REDIS_URL}:6379/0`
  } else {
    return process.env.REDIS_URL
  }
}

module.exports = {
  buildRedisUrl
}
