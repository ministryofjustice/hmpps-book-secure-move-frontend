afterEach(() => {
  sinon.restore()
  nock.cleanAll()
  mockFs.restore()
})
