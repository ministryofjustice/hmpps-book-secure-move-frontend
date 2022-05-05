const CONFIG = require('../../config')
const redisStore = require('../../config/redis-store.js')

const scanAndDelete = async (cursor, pattern) => {
  const client = (await redisStore()).client
  const [nextCursor, keys] = await client.scanAsync(
    cursor,
    'MATCH',
    pattern,
    'COUNT',
    '100'
  )

  await Promise.all(keys.map(key => client.del(key)))

  if (nextCursor !== '0') {
    return keys.length + (await scanAndDelete(nextCursor, pattern))
  }

  return keys.length
}

const clearCacheReferenceData = async (referenceName = '') => {
  return await scanAndDelete(
    '0',
    `cache:v${CONFIG.API.VERSION}:GET./api/reference/${referenceName}*`
  )
}

module.exports = clearCacheReferenceData
