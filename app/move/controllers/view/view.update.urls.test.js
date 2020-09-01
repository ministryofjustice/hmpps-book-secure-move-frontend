const getUpdateUrls = require('./view.update.urls')

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
      const userPermissions = ['move:allowed', 'move:update:prison_transfer']
      beforeEach(function () {
        updateUrls = getUpdateUrls(
          updateSteps,
          { id: 'moveId', move_type: 'prison_transfer' },
          userPermissions
        )
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

      it('should not expose url when the permission do not match', function () {
        updateUrls = getUpdateUrls(
          updateSteps,
          { id: 'moveId', move_type: 'hospital' },
          userPermissions
        )
        expect(updateUrls).to.deep.equal({})
      })
    })
  })
})
