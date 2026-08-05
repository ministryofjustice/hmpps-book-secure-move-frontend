/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-process-env */
import fs from 'fs'

import concurrently, { Command } from 'concurrently'
import glob from 'glob'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers';

/**
 * Allow environment variables set at the project level tp be overridden for current PR
 * eg. Given a CIRCLE_PR_NUMBER of 123
 * if set, PR123_E2E_VIDEO will be used in place of E2E_VIDEO
 */
// CIRCLE_PR_NUMBER should exist but is missing
// Use CIRCLE_PULL_REQUEST and strip github url up to number
const { CIRCLE_PULL_REQUEST = '' } = process.env
const prNumber = CIRCLE_PULL_REQUEST.replace(/.*\//, '')

process.on('unhandledRejection', (reason, p) => {
  process.stdout.write(
    `Unhandled Rejection at: Promise ${p}, reason: ${reason}`
  )
})

if (prNumber) {
  const prPrefix = `PR${prNumber}_`
  const prEnvVars = Object.keys(process.env).filter(prKey =>
    prKey.startsWith(prPrefix)
  )
  prEnvVars.forEach(prKey => {
    const envKey = prKey.replace(prPrefix, '')
    process.env[envKey] = process.env[prKey]
  })
}

/**
 * Empty strings can be passed as a space
 * `false` and `true` will be coerced to boolean values
 */
Object.keys(process.env).forEach(key => {
  process.env[key] = process.env[key]?.trim()
})

const getEnvVar = (key: string) => {
  let value: string | boolean | undefined = process.env[key]

  if (value === undefined) {
    return
  }

  value = value.trim()

  if (value === 'false') {
    value = false
  } else if (value === 'true') {
    value = true
  }

  return value
}

const E2E_MAX_PROCESSES = getEnvVar('E2E_MAX_PROCESSES')
const E2E_SKIP = getEnvVar('E2E_SKIP')
const E2E_FAIL_FAST = getEnvVar('E2E_FAIL_FAST')
const E2E_BASE_URL = getEnvVar('E2E_BASE_URL')
const E2E_VIDEO = getEnvVar('E2E_VIDEO')
const E2E_SHARD_INDEX = getEnvVar('E2E_SHARD_INDEX') || 0
const E2E_SHARD_TOTAL = getEnvVar('E2E_SHARD_TOTAL') || 1
const FEATURE_FLAG_EXTRADITION_MOVES = getEnvVar(
  'FEATURE_FLAG_EXTRADITION_MOVES'
)
const FEATURE_FLAG_SECTION_46 = getEnvVar('FEATURE_FLAG_SECTION_46')

const args: any = yargs(hideBin(process.argv))
  .usage(
    `
e2e test runner

  Usage:

  node $0 [options]
  npm run test-e2e -- [options]
  `
  )
  .help('help')
  .alias('help', 'h')
  .version('version', '1.0.0')
  .alias('version', 'V')
  .example('npm run test-e2e', 'Run all the tests')
  .example(
    'npm run test-e2e -- --test test/e2e/move/new/police/to-court.test.js',
    'Run a single test'
  )
  .example(
    'npm run test-e2e -- --skip test/e2e/move/new/police/to-court.test.js',
    'Run all tests except one'
  )
  .example(
    'npm run test-e2e -- --max_processes 3',
    'Run with a specific number of runners'
  )
  .example('npm run test-e2e -- --debug', 'Debug on fail')
  .example('npm run test-e2e -- --video', 'Capture video when tests fail')
  .example('npm run test-e2e -- -n', 'Dry run')
  .option('test', {
    alias: 't',
    type: 'array',
    description: 'Test[s] to run',
  })
  .option('skip', {
    alias: 's',
    type: 'array',
    description: 'Test[s] to skip',
  })
  .option('agent', {
    alias: 'a',
    type: 'string',
    default: 'chrome',
    description: 'Agent to use for tests',
  })
  .option('headless', {
    type: 'boolean',
    default: true,
    description: `Whether to run in headless mode
(will be set to false if debug is true)`,
  })
  .option('stop-on-first-fail', {
    type: 'boolean',
    default: false,
    description: 'Whether to stop on first fail',
  })
  .option('debug', {
    alias: 'd',
    type: 'boolean',
    default: false,
    description: `Whether to debug on fail
(will set headless to false if true)`,
  })
  .option('max_processes', {
    alias: 'm',
    type: 'number',
    default: Number(E2E_MAX_PROCESSES || 1),
    description: 'Number of processes to use',
  })
  .option('reporter', {
    alias: 'r',
    type: 'boolean',
    default: true,
    description: 'Whether to output reports',
  })
  .option('color', {
    alias: 'c',
    type: 'boolean',
    default: true,
    description: 'Whether to colorize output',
  })
  .option('video', {
    type: 'boolean',
    default: !!E2E_VIDEO,
    description: 'Whether to capture video',
  })
  .option('testcafe', {
    type: 'string',
    description: 'Additonal args for testcafe',
  })
  .option('dryrun', {
    alias: 'n',
    type: 'boolean',
    default: false,
    description: 'Display commands that would be run',
  }).argv

process.stdout.write(`
ENV VARS:
E2E_MAX_PROCESSES: ${E2E_MAX_PROCESSES}
E2E_SKIP:          ${E2E_SKIP}
E2E_VIDEO:         ${E2E_VIDEO}
E2E_FAIL_FAST:     ${E2E_FAIL_FAST}
E2E_BASE_URL:      ${E2E_BASE_URL}
FEATURE_FLAG_EXTRADITION_MOVES:      ${FEATURE_FLAG_EXTRADITION_MOVES}
FEATURE_FLAG_SECTION_46:      ${FEATURE_FLAG_SECTION_46}
E2E_SHARD_INDEX:   ${E2E_SHARD_INDEX}
E2E_SHARD_TOTAL:   ${E2E_SHARD_TOTAL}
`)

if (args.video && args.max_processes > 8) {
  process.stdout.write(
    '⚠️  Max processes capped to 8 as video capture is enabled\n'
  )
}

const maxProcesses = args.video
  ? Math.min(args.max_processes, 8)
  : args.max_processes
const debugOnFail = args.debug ? '--debug-on-fail' : ''

if (debugOnFail) {
  args.headless = false
}

const stopOnFirstFail =
  args['fail-fast'] || E2E_FAIL_FAST ? '--stop-on-first-fail' : ''
const killOthers: ('failure' | 'success')[] | undefined = stopOnFirstFail
  ? ['failure']
  : undefined
const agent = args.headless
  ? `'${args.agent} --headless=new'`
  : `'${args.agent}'`
const color = args.color ? '--color' : ''
const testcafeArgs = args.testcafe || ''
const skip = args.skip
const screenshots =
  "--screenshots path=artifacts/screenshots,takeOnFails=true,fullPage=true,pathPattern='${DATE}_${TIME}/${TEST}/${USERAGENT}/${FILE_INDEX}.png'"
const video = args.video
  ? "--video artifacts/videos --video-options failedOnly=true,pathPattern='${DATE}_${TIME}/${TEST}/${USERAGENT}/${FILE_INDEX}.mp4'"
  : ''

// Recorded per-file TestCafe durations (seconds), populated by CI from the
// previous run's xunit output (see the `restore shard weights cache` and
// `save_shard_weights` steps in node_e2e_tests.yml, and build-shard-weights.ts).
// Test files aren't equal weight (some run 5 users through a full journey,
// others are a single quick case) so distributing by file count alone leaves
// some shards/processes far heavier than others.
// Nothing is committed to the repo: locally, and on the very first CI run
// before any history exists, this file won't exist yet - fall back to
// treating every file as equal weight, which reduces bucketByWeight to a
// plain round-robin split.
let shardWeights: Record<string, number> = {}
try {
  shardWeights = JSON.parse(
    fs.readFileSync(`${__dirname}/shard-weights.json`, 'utf8')
  )
} catch {
  // No recorded timings yet - equal weighting below.
}
const knownWeights = Object.values(shardWeights)
const defaultWeight = knownWeights.length
  ? knownWeights.reduce((sum, weight) => sum + weight, 0) / knownWeights.length
  : 1
const getWeight = (test: string) => shardWeights[test] ?? defaultWeight

/**
 * Greedy longest-processing-time-first bin packing: place the heaviest
 * remaining file into whichever bucket currently has the least work. This is
 * deterministic for a given `items` + weights, which matters here because
 * each shard runs this script independently (on its own checked-out CI VM,
 * via its own glob.sync()) and they must all agree on the same partition
 * without coordinating with each other.
 */
const bucketByWeight = (items: string[], bucketCount: number): string[][] => {
  const buckets: string[][] = Array.from({ length: bucketCount }, () => [])
  const totals = new Array(bucketCount).fill(0)

  items
    .slice()
    .sort((a, b) => getWeight(b) - getWeight(a) || a.localeCompare(b))
    .forEach(item => {
      const lightest = totals.indexOf(Math.min(...totals))
      buckets[lightest].push(item)
      totals[lightest] += getWeight(item)
    })

  return buckets
}

const allTests = glob.sync('test/e2e/**/*.test.js')
// args.test may contain literal file paths or glob patterns (eg. CI passes
// the pattern unexpanded) - expand each through glob so both work the same
// way TestCafe's own glob resolution otherwise silently under-matches
let tests: string[] = args.test
  ? (args.test as string[]).flatMap((pattern: string) => glob.sync(pattern))
  : allTests

const envSkip = ((E2E_SKIP as string) || '').split(',')
tests = tests.filter(test => !envSkip.includes(test))

if (skip) {
  tests = tests.filter(test => !skip.includes(test))
}

// A shardTotal of 1 (the default) is a no-op here, since bucketByWeight puts
// everything in the single bucket at index 0.
const shardTotal = Number(E2E_SHARD_TOTAL)
const shardIndex = Number(E2E_SHARD_INDEX)
tests = bucketByWeight(tests, shardTotal)[shardIndex] ?? []

const skippedTests = allTests.filter(test => !tests.includes(test))

process.stdout.write(`Running:
  ${tests.join('\n  ')}

${
  skippedTests.length
    ? `Skipping:
  ${skippedTests.join('\n  ')}
`
    : ''
}
`)

const testBuckets = bucketByWeight(
  tests,
  Math.min(maxProcesses, tests.length)
).filter(bucket => bucket.length > 0)

const testcafeRuns = testBuckets.map((test, index) => {
  const name = `run-${index + 1}`
  const reporter = args.reporter
    ? `--reporter spec,xunit:reports/testcafe/results-${agent}__${name}.xml`
    : ''
  const command = `SERVER_HOST=localhost:${
    3000 + index
  } E2E_BASE_URL=http://localhost:${
    3000 + index
  } AUTH_PROVIDER_URL=http://localhost:${
    3999 + index
  } MANAGE_USERS_API_URL=http://localhost:${
    3999 + index
  } NOMIS_ELITE2_API_URL=http://localhost:${
    3999 + index
  } node_modules/.bin/testcafe ${agent} ${test.join(
    ' '
  )} ${color} --retry-test-pages -q attemptLimit=3,successThreshold=1 -e ${reporter} ${screenshots} ${video} ${stopOnFirstFail} ${debugOnFail} ${testcafeArgs}`
  return {
    name,
    command,
  }
})

process.stdout.write(
  `Commands to be executed:

${testcafeRuns.map(t => `[${t.name}] ${t.command}`).join('\n\n')}

Processes: ${maxProcesses}
Fail fast: ${stopOnFirstFail ? 'yes' : 'no'}
`
)

if (args.n) {
  process.stdout.write('\n\nTests have not been run.')
  process.exit()
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function killCommands(commands: Command[]) {
  return concurrently([`kill ${commands.map(c => c.pid).join(' ')}`]).result
}

const runTests = async () => {
  const serverCommandStrings = testBuckets.map(
    (_, i) =>
      `PORT=${3000 + i} AUTH_PROVIDER_URL=http://localhost:${
        3999 + i
      } MANAGE_USERS_API_URL=http://localhost:${
        3999 + i
      } SERVER_HOST=localhost:${3000 + i} E2E_BASE_URL=http://localhost:${
        3000 + i
      } NOMIS_ELITE2_API_URL=http://localhost:${
        3999 + i
      } FEATURE_FLAG_ADD_LODGE_BUTTON=true FEATURE_FLAG_EXTRADITION_MOVES=true FEATURE_FLAG_SECTION_46=true FEATURE_FLAG_EDITABILITY=true FEATURE_FLAG_IMAGES=true FEATURE_FLAG_PRISON_COURT_HEARINGS=true FEATURE_FLAG_PRISON_COURT_TIMETABLE=true FEATURE_FLAG_PERSON_ESCORT_RECORD=true FEATURE_FLAG_MOVE_PREVIEW=true FEATURE_FLAG_WHATS_NEW_BANNER=true FEATURE_FLAG_DATE_OF_ARREST=true FEATURE_FLAG_FUZZY_PNC_SEARCH=true node start.js`
  )
  const authCommandStrings = testBuckets.map(
    (_, i) =>
      `SERVER_HOST=localhost:${3000 + i} E2E_BASE_URL=http://localhost:${
        3000 + i
      } MOCK_AUTH_PORT=${3999 + i} node mocks/auth-server.js`
  )

  const { commands: serverCommands } = concurrently(
    serverCommandStrings.concat(authCommandStrings),
    {
      outputStream: fs.createWriteStream('/dev/null'),
    }
  )
  await sleep(5000)

  try {
    await concurrently(testcafeRuns, {
      killOthers,
    }).result
  } catch {
    try {
      await killCommands(serverCommands)
    } catch {}

    process.exit(1)
  } finally {
    try {
      await killCommands(serverCommands)
    } catch {}

    process.exit()
  }
}

runTests()
