const chai = require('chai')
const sinon = require('sinon')

chai.use(require('sinon-chai'))
chai.use(require('chai-as-promised'))

// mocha globals
global.expect = chai.expect
global.sinon = sinon
