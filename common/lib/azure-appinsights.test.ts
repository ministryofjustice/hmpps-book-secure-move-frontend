describe.skip('azure-appinsights', function () {
  describe('addUserDataToRequests', function () {
    it('adds user data to properties when present', function () {
      // TODO: Adding tests has been particularly troublesome, because the
      // applicationinsights library monkey patches a lot of stuff, which
      // then causes proxyquire to fail in other, seemingly-unrelated test
      // files. So we have tested this manually for now instead, until we
      // can find a way of creating reliable automated tests.
    })
  })
})
