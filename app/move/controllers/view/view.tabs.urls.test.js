const getTabsUrls = require('./view.tabs.urls')

describe('Move controllers', function () {
  describe('#view()', function () {
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
})
