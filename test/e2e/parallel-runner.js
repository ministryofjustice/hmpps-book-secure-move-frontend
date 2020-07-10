/* eslint-disable no-process-env */
const concurrently = require('concurrently')
const glob = require('glob')
const args = require('yargs')
  .help('h')
  .option('test', {
    alias: 't',
    type: 'string',
    description: 'Test[s] to run',
  })
  .option('skip', {
    alias: 's',
    type: 'string',
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
    description: 'Whether to run in headless mode',
  })
  .option('debug', {
    alias: 'd',
    type: 'boolean',
    default: false,
    description: 'Whether to debug on fail',
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

let tests = args.test

if (tests) {
  if (!Array.isArray(tests)) {
    tests = [tests]
  }
} else {
  tests = glob.sync('test/e2e/*.test.js').reverse()
}

let skip = args.skip

if (skip) {
  if (!Array.isArray(skip)) {
    skip = [skip]
  }

  tests = tests.filter(test => !skip.includes(test))
}

const npmTests = tests.map(test => {
  const name = test.replace(/.*\//, '').replace(/\.test.js/, '')
  const reporter = args.reporter
    ? `--reporter spec,xunit:reports/testcafe/results-chrome__${name}.xml`
    : ''
  const command = `node_modules/.bin/testcafe ${agent} ${test} ${color} ${reporter} ${config} ${debugOnFail} ${testcafeArgs}`
  return {
    name,
    command,
  }
})

concurrently(npmTests, {
  maxProcesses,
}).then(
  () => {},
  () => {
    process.exit(1)
  }
)
