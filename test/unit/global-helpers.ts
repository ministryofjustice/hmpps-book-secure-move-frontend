import mockFs from 'mock-fs'
import nock from 'nock'
import sinon from 'sinon'

afterEach(() => {
  sinon.restore()
  nock.cleanAll()
  mockFs.restore()
})
