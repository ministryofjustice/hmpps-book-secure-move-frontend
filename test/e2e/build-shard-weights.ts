/* eslint-disable no-process-env */
import fs from 'fs'

import glob from 'glob'

/**
 * Merges this run's observed per-file TestCafe durations (from the xunit
 * reports every shard already uploads) into the shard-weights cache that
 * parallel-runner.ts uses to balance the next run's shards. Run once, after
 * all shards finish, against the downloaded xunit artifacts - see the
 * `save_shard_weights` job in node_e2e_tests.yml.
 *
 * Usage:
 *   ts-node build-shard-weights.ts <xunitResultsDir> <existingWeightsPath> <outputPath>
 *
 * `existingWeightsPath` may not exist yet (eg. the very first run) - in that
 * case we start from an empty set of weights.
 */
const [, , xunitDir, existingWeightsPath, outputPath] = process.argv

if (!xunitDir || !existingWeightsPath || !outputPath) {
  process.stderr.write(
    'Usage: build-shard-weights.ts <xunitResultsDir> <existingWeightsPath> <outputPath>\n'
  )
  process.exit(1)
}

const weights: Record<string, number> = fs.existsSync(existingWeightsPath)
  ? JSON.parse(fs.readFileSync(existingWeightsPath, 'utf8'))
  : {}

const observed: Record<string, number> = {}
const testcaseRe = /<testcase[^>]*\bfile="([^"]*)"[^>]*\btime="([0-9.]+)"/g

glob.sync(`${xunitDir}/**/*.xml`).forEach(xmlFile => {
  const xml = fs.readFileSync(xmlFile, 'utf8')
  let match: RegExpExecArray | null

  // eslint-disable-next-line no-cond-assign
  while ((match = testcaseRe.exec(xml))) {
    const file = match[1].replace(/^.*?(test\/e2e\/.*)$/, '$1')
    const time = Number(match[2])
    observed[file] = (observed[file] || 0) + time
  }
})

// This run's observed durations replace any previous entry for the same
// file; files not touched this run (eg. skipped by `stopOnFirstFail`) keep
// their last known duration rather than being dropped.
const merged = { ...weights, ...observed }

fs.writeFileSync(outputPath, `${JSON.stringify(merged, null, 2)}\n`)

process.stdout.write(
  `Recorded timings for ${Object.keys(observed).length} file(s) this run (${
    Object.keys(merged).length
  } tracked in total)\n`
)
