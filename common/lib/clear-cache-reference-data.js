const CONFIG = require('../../config')
const redisStore = require('../../config/redis-store.js')

const scanAndDelete = (cursor, pattern) => {
  const client = redisStore().client
  return client
    .scanAsync(cursor, 'MATCH', pattern, 'COUNT', '100')
    .then(async ([nextCursor, keys]) => {
      await Promise.all(keys.map(key => client.del(key)))

      if (nextCursor !== '0') {
        return keys.length + (await scanAndDelete(nextCursor, pattern))
      }

      return keys.length
    })
}

const clearCacheReferenceData = (referenceName = '') => {
  return scanAndDelete(
    '0',
    `cache:v${CONFIG.API.VERSION}:GET./api/reference/${referenceName}*`
  )
}

module.exports = clearCacheReferenceData
