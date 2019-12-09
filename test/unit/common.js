const { requireUncached } = require('./helpers')

const chai = require('chai')
const sinon = require('sinon')
const nock = require('nock')
const mockFs = require('mock-fs')

chai.use(require('sinon-chai'))
chai.use(require('chai-as-promised'))

// mocha globals
global.expect = chai.expect
global.sinon = sinon
global.nock = nock
global.mockFs = mockFs

// global helpers
global.requireUncached = requireUncached
