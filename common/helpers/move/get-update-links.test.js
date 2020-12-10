const proxyquire = require('proxyquire')
const i18n = {
  t: sinon.stub(),
}
const getUpdateUrls = sinon.stub()

const getUpdateLinks = proxyquire('./get-update-links', {
  '../../../config/i18n': i18n,
  './get-update-urls': getUpdateUrls,
})

const updateSteps = [
  {
    key: 'foo',
  },
  {
    key: 'bar',
  },
]

const urls = {
  foo: '/move/moveId/edit/foo',
}
getUpdateUrls.returns(urls)

const req = {
  move: {
    id: 'moveId',
  },
  canAccess: () => true,
}

const expectedUpdateLinks = {
  foo: {
    attributes: {
      'data-update-link': 'foo',
    },
    category: 'foo',
    href: '/move/moveId/edit/foo',
    html: 'Update foo',
  },
}

describe('Move controllers', function () {
  describe('#view()', function () {
    describe('#getUpdateLinks', function () {
      let updateLinks
      const t = i18n.t
      beforeEach(function () {
        getUpdateUrls.resetHistory()
        t.resetHistory()
        t.callsFake((key, args) => {
          if (args) {
            return `Update ${args.category}`
          }

          return key.replace(/moves::update_link.categories./, '')
        })
        updateLinks = getUpdateLinks(updateSteps, req)
      })
      it('should get the update urls', function () {
        expect(getUpdateUrls).to.be.calledOnceWithExactly(updateSteps, req)
      })

      it('should invoke t twice', function () {
        expect(t.callCount).to.equal(2)
      })

      it('should invoke t first time with expected args', function () {
        expect(t.getCall(0).args).to.deep.equal([
          'moves::update_link.categories.foo',
        ])
      })

      it('should invoke t second time with expected args', function () {
        expect(t.getCall(1).args).to.deep.equal([
          'moves::update_link.link_text',
          {
            context: 'with_category',
            category: 'foo',
          },
        ])
      })

      it('should get expected value for key', function () {
        expect(updateLinks.foo).to.deep.equal(expectedUpdateLinks.foo)
      })

      it('should return undefined if the route has no url', function () {
        expect(updateLinks.bar).to.be.undefined
      })
    })
  })
})
