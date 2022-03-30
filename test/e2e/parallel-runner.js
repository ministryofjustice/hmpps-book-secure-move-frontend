/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-process-env */
const concurrently = require('concurrently')
const glob = require('glob')
const yargs = require('yargs')

/**
 * Allow environment variables set at the project level tp be overridden for current PR
 * eg. Given a CIRCLE_PR_NUMBER of 123
 * if set, PR123_E2E_VIDEO will be used in place of E2E_VIDEO
 */
// CIRCLE_PR_NUMBER should exist but is missing
// Use CIRCLE_PULL_REQUEST and strip github url up to number
const { CIRCLE_PULL_REQUEST = '' } = process.env
const prNumber = CIRCLE_PULL_REQUEST.replace(/.*\//, '')

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
  process.env[key] = process.env[key].trim()
})

const getEnvVar = key => {
  let value = process.env[key]

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

const args = yargs
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
  .example('npm run test-e2e -- --test test/e2e/move.new.police.test.js')
  .example('npm run test-e2e -- --skip test/e2e/move.new.police.test.js')
  .example('npm run test-e2e -- --max_processes 3')
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
`)

// ffmpeg is memory hungry so we can't have too many instances of it running
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
const killOthers = stopOnFirstFail ? ['failure'] : undefined
const agent = `${args.agent}${args.headless ? ':headless' : ''}`
const color = args.color ? '--color' : ''
const testcafeArgs = args.testcafe || ''
const skip = args.skip
const screenshots =
  "--screenshots path=artifacts/screenshots,takeOnFails=true,fullPage=true,pathPattern='${DATE}_${TIME}/${TEST}/${USERAGENT}/${FILE_INDEX}.png'"
const video = args.video
  ? "--video artifacts/videos --video-options failedOnly=true,pathPattern='${DATE}_${TIME}/${TEST}/${USERAGENT}/${FILE_INDEX}.mp4'"
  : ''

const allTests = glob.sync('test/e2e/*.test.js')
let tests = args.test || allTests

const envSkip = (E2E_SKIP || '').split(',')
tests = tests.filter(test => !envSkip.includes(test))

if (skip) {
  tests = tests.filter(test => !skip.includes(test))
}

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

const testBuckets = tests.reduce((memo, value, index) => {
  if (index < maxProcesses) {
    memo.push([])
  }

  memo[index % maxProcesses].push(value)
  return memo
}, [])

const testcafeRuns = testBuckets.map((test, index) => {
  const name = `run-${index + 1}`
  const reporter = args.reporter
    ? `--reporter spec,xunit:reports/testcafe/results-chrome__${name}.xml`
    : ''
  const command = `node_modules/.bin/testcafe ${agent} ${test.join(
    ' '
  )} ${color} ${reporter} ${screenshots} ${video} ${stopOnFirstFail} ${debugOnFail} ${testcafeArgs}`
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

const runTests = async () => {
  try {
    await concurrently(testcafeRuns, {
      maxProcesses,
      killOthers,
    }).result
  } catch (e) {
    process.exit(1)
  }
}

runTests()
