const CONFIG = require('../../config')
const redisStore = require('../../config/redis-store.js')

const scanAndDelete = async pattern => {
  const client = (await redisStore()).client
  console.log(`Scanning for keys matching pattern: ${pattern}`)
  let count = 0

  for await (const key of client.scanIterator({
    MATCH: pattern,
    COUNT: 100,
  })) {

    console.log(key)
    console.log(`Type of key: ${typeof key}, Length of key: ${key.length}`)
    if (typeof key !== 'string' || key.length === 0) {
      console.log(`Skipping invalid key: ${key}`)
      continue
    }
    console.log(`Deleting key: ${key}`)
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
