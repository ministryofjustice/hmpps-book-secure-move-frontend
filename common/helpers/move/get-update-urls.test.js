const proxyquire = require('proxyquire')

const updateSteps = [
  {
    key: 'foo',
    permission: 'move:allowed',
    steps: { '/foo': { entryPoint: true } },
  },
  {
    key: 'bar',
    permission: 'move:allowed',
    steps: { '/another-step': { entryPoint: true } },
  },
  {
    key: 'baz',
    permission: 'move:forbidden',
    steps: { '/baz': { entryPoint: true } },
  },
]

const getUpdateUrls = proxyquire('./get-update-urls', {
  '../../../app/move/app/edit/steps': updateSteps,
})

describe('Move helpers', function () {
  describe('#getUpdateUrls', function () {
    let updateUrls
    let move
    let canAccess

    beforeEach(function () {
      move = { _canEdit: true, id: 'moveId' }
      canAccess = sinon.stub().returns(false)
    })

    describe('when permision matches', function () {
      beforeEach(function () {
        canAccess.withArgs('move:allowed').returns(true)
      })

      context('when move is editable', function () {
        beforeEach(function () {
          updateUrls = getUpdateUrls(move, canAccess)
        })

        it('should get expected values for key', function () {
          expect(updateUrls).to.deep.equal({
            foo: '/move/moveId/edit/foo',
            bar: '/move/moveId/edit/another-step',
          })
        })

        it('should remove keys with missing permissions', function () {
          expect(Object.keys(updateUrls)).not.to.contain('baz')
        })
      })

      context('when move is not editable', function () {
        beforeEach(function () {
          move._canEdit = false
          updateUrls = getUpdateUrls(move, canAccess)
        })

        it('should not expose any urls', function () {
          expect(updateUrls).to.deep.equal({})
        })
      })
    })

    describe('when called without canAccess function', function () {
      beforeEach(function () {
        updateUrls = getUpdateUrls(move)
      })

      it('should not expose any urls', function () {
        expect(updateUrls).to.deep.equal({})
      })
    })
  })
})
