const chai = require('chai')
const mockFs = require('mock-fs')
const nock = require('nock')
const sinon = require('sinon')

const { requireUncached } = require('./helpers')

chai.use(require('sinon-chai'))
chai.use(require('chai-as-promised'))

// mocha globals
global.expect = chai.expect
global.sinon = sinon
global.nock = nock
global.mockFs = mockFs

// global helpers
global.requireUncached = requireUncached
