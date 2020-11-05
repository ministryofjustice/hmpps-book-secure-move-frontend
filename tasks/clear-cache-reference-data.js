const { hideBin } = require('yargs/helpers')
const yargs = require('yargs/yargs')

const clearCacheReferenceData = require('../common/lib/clear-cache-reference-data')

const clearCacheReferenceDataCommand = async referenceName => {
  if (!referenceName || referenceName.length === 0) {
    process.stderr.write(`Missing required argument: referenceData
Check the project README.md for a list of possible values.
`)
    process.exit(1)
  }

  process.stdout.write(`Purging reference/${referenceName} from Redis cache.
`)
  const count = await clearCacheReferenceData(referenceName)
  process.stdout.write(`Purged ${count} reference/${referenceName}.
`)
  process.exit(0)
}

// eslint-disable-next-line no-unused-vars
const args = yargs(hideBin(process.argv))
  .command(
    '$0 [referenceName]',
    'Clear reference data from the redis cache',
    yargs => {
      yargs.positional('referenceName', {
        describe: 'the type of reference data to clear',
        type: 'string',
      })
    },
    async argv => {
      await clearCacheReferenceDataCommand(argv.referenceName)
    }
  )
  .version('version', '1.0.0')
  .alias('version', 'V').argv
