import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import mockFs from 'mock-fs'
import nock from 'nock'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

const { requireUncached } = require('./helpers')

chai.use(sinonChai)
chai.use(chaiAsPromised)

// mocha globals
// @ts-expect-error Global scope has no type
global.expect = chai.expect
global.sinon = sinon
// @ts-expect-error Global scope has no type
global.nock = nock
// @ts-expect-error Global scope has no type
global.mockFs = mockFs

// global helpers
// @ts-expect-error Global scope has no type
global.requireUncached = requireUncached
