const CONFIG = require('../../config')
const redisStore = require('../../config/redis-store.js')

const scanAndDelete = async pattern => {
  const client = (await redisStore()).client

  let count = 0

  for await (const key of client.scanIterator({
    MATCH: pattern,
    COUNT: 100,
  })) {
    if (typeof key !== 'string' || key.length === 0) {
      continue
    }

    await client.del(key)
    count++
  }

  return count
}

const clearCacheReferenceData = async (referenceName = '') => {
  return await scanAndDelete(`cache:v${CONFIG.API.VERSION}:GET./api/reference/${referenceName}*`
  )
}

module.exports = clearCacheReferenceData
