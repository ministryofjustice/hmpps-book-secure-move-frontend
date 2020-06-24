const createTestCafe = require('testcafe')

const runTests = async () => {
  const testcafe = await createTestCafe('localhost', 1337, 1338)
  const runner = testcafe.createRunner()
  const failedCount = await runner
    .src('./test/e2e/*.test.js')
    .filter((testName, fixtureName, fixturePath, testMeta, fixtureMeta) => {
      return !testMeta.hasDocument
    })
    .browsers(['chrome:headless'])
    .run()

  if (failedCount) {
    // eslint-disable-next-line no-console
    console.log(`
Try running the failing tests individually in non-headless mode

node_modules/.bin/testcafe chrome test/e2e/<path>.test.js --debug-on-fail
`)
    process.exit(1)
  }

  testcafe.close()
  process.exit()
}

runTests()
