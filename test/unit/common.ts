import chai from 'chai'
import mockFs from 'mock-fs'
import nock from 'nock'
import sinon from 'sinon'

const { requireUncached } = require('./helpers')

chai.use(require('sinon-chai'))
chai.use(require('chai-as-promised'))

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
