const getTabsUrls = require('./get-tabs-urls')

describe('Move helpers', function () {
  describe('#getTabsUrls', function () {
    const tabsUrls = getTabsUrls({ id: 'foo' })

    it('should get expected value for key', function () {
      expect(tabsUrls).to.deep.equal({
        view: '/move/foo',
        timeline: '/move/foo/timeline',
      })
    })
  })
})
