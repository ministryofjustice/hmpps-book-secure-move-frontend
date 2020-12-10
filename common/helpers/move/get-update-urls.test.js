const getUpdateUrls = require('./get-update-urls')

const updateSteps = [
  {
    key: 'foo',
    permission: 'move:allowed',
    steps: { '/foo': { entryPoint: true } },
  },
  {
    key: 'bar',
    permission: 'move:allowed',
    steps: { '/another-step': {}, '/bar-details': { entryPoint: true } },
  },
  {
    key: 'baz',
    permission: 'move:forbidden',
    steps: { '/baz': { entryPoint: true } },
  },
]

describe('Move controllers', function () {
  describe('#view()', function () {
    describe('#getUpdateUrls', function () {
      let updateUrls
      const req = {
        canAccess: sinon.stub().returns(false),
      }

      describe('when permision matches', function () {
        beforeEach(function () {
          req.move = { id: 'moveId', move_type: 'prison_transfer' }
          req.canAccess
            .withArgs('move:update:prison_transfer')
            .returns(true)
            .withArgs('move:allowed')
            .returns(true)
          updateUrls = getUpdateUrls(updateSteps, req)
        })
        it('should get expected value for key', function () {
          expect(updateUrls.foo).to.equal('/move/moveId/edit/foo')
        })

        it('should get expected value for key when multiple steps exist', function () {
          expect(updateUrls.bar).to.equal('/move/moveId/edit/bar-details')
        })

        it('should return undefined if the route is inaccessible', function () {
          expect(updateUrls.baz).to.be.undefined
        })
      })

      describe('when permission does not match', function () {
        beforeEach(function () {
          req.move = { id: 'moveId', move_type: 'hospital' }
          req.canAccess
            .withArgs('move:update:prison_transfer')
            .returns(true)
            .withArgs('move:allowed')
            .returns(true)
          updateUrls = getUpdateUrls(updateSteps, req)
        })
        it('should not expose url', function () {
          expect(updateUrls).to.deep.equal({})
        })
      })
    })
  })
})
