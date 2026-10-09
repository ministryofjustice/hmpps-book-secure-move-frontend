const CONFIG = require('../../config')
const redisStore = require('../../config/redis-store.js')

const scanAndDelete = async pattern => {
  const client = (await redisStore()).client
  let count = 0

  for await (const keys of client.scanIterator({
    MATCH: pattern,
    COUNT: 100,
  })) {
    if (keys.length === 0) {
      continue
    }
    count += await client.del(keys)
  }

  return count
}

const clearCacheReferenceData = async (referenceName = '') => {
  return await scanAndDelete(
    `cache:v${CONFIG.API.VERSION}:GET./api/reference/${referenceName}*`
  )
}

module.exports = clearCacheReferenceData
