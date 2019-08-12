const config = require('./index')

describe('App Config', function() {
  describe('AUTH_PROVIDERS.hmpps.groups_url', function() {
    let url

    it('constructs a path using the userName parameter', function() {
      url = config.AUTH_PROVIDERS.hmpps.groups_url('test')
      expect(new URL(url).pathname).to.equal('/auth/api/authuser/test/groups')
    })
  })
})
