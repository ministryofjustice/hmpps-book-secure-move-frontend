const createTestCafe = require('testcafe')

const runTests = async () => {
  const testcafe = await createTestCafe('localhost', 1337, 1338)
  const runner = testcafe.createRunner()
  const failedCount = await runner
    .src('./test/e2e/*.test.js')
    .filter(
      (
        _testName: string,
        _fixtureName: string,
        _fixturePath: string,
        testMeta: any,
        _fixtureMeta: any
      ) => {
        return !testMeta.hasDocument
      }
    )
    .browsers(['chrome:headless'])
    .run()

  if (failedCount) {
    // eslint-disable-next-line no-console
    console.log(`
Try running the failing tests individually in non-headless mode

npm run test-e2e:local -- -t test/e2e/<path>.test.js

`)
    process.exit(1)
  }

  testcafe.close()
  process.exit()
}

runTests()
