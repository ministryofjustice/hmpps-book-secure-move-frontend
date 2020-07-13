/* eslint-disable no-process-env */
const concurrently = require('concurrently')
const glob = require('glob')
const args = require('yargs')
  .usage(
    `e2e test runner

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
    default: Number(process.env.E2E_MAX_PROCESSES || 1),
    description: 'Whether to output reports',
  })
  .option('config', {
    type: 'string',
    description: 'Path to alternative config',
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

const maxProcesses = args.max_processes
const debugOnFail = args.debug ? '--debug-on-fail' : ''

if (debugOnFail) {
  args.headless = false
}

const agent = `${args.agent}${args.headless ? ':headless' : ''}`
const color = args.color ? '--color' : ''
const config = args.config ? `--ts-config-path ${args.config}` : ''
const testcafeArgs = args.testcafe || ''
const skip = args.skip

let tests = args.test
const allTests = glob.sync('test/e2e/*.test.js')

if (!tests) {
  tests = allTests.reverse()
}

const envSkip = (process.env.E2E_SKIP || '').split(',')
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
  )} ${color} ${reporter} ${config} ${debugOnFail} ${testcafeArgs}`
  return {
    name,
    command,
  }
})

if (args.n) {
  process.stdout.write(
    `Tests have not been run. Commands that would have been executed:

${testcafeRuns.map(t => `[${t.name}] ${t.command}`).join('\n\n')}
`
  )
  process.exit()
}

concurrently(testcafeRuns, {
  maxProcesses,
}).then(
  () => {},
  () => {
    process.exit(1)
  }
)
