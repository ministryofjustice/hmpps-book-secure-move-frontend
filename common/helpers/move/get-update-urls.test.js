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

describe('Move helpers', function () {
  describe('#getUpdateUrls', function () {
    let updateUrls
    let move
    let canAccess

    beforeEach(function () {
      canAccess = sinon.stub().returns(false)
    })

    describe('when permision matches', function () {
      beforeEach(function () {
        move = { id: 'moveId', move_type: 'prison_transfer' }
        canAccess
          .withArgs('move:update:prison_transfer')
          .returns(true)
          .withArgs('move:allowed')
          .returns(true)
      })

      context('when move has not left custody', function () {
        beforeEach(function () {
          updateUrls = getUpdateUrls(move, canAccess, updateSteps)
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

      context('when move has left custody', function () {
        beforeEach(function () {
          move._hasLeftCustody = true
          updateUrls = getUpdateUrls(move, canAccess, updateSteps)
        })

        it('should not expose any urls', function () {
          expect(updateUrls).to.deep.equal({})
        })
      })
    })

    describe('when permission does not match', function () {
      beforeEach(function () {
        move = { id: 'moveId', move_type: 'hospital' }
        canAccess
          .withArgs('move:update:prison_transfer')
          .returns(true)
          .withArgs('move:allowed')
          .returns(true)
        updateUrls = getUpdateUrls(move, canAccess, updateSteps)
      })
      it('should not expose urls', function () {
        expect(updateUrls).to.deep.equal({})
      })
    })

    describe('when called without canAccess function', function () {
      beforeEach(function () {
        move = { id: 'moveId', move_type: 'hospital' }
        canAccess = undefined
        updateUrls = getUpdateUrls(move, canAccess, updateSteps)
      })
      it('should not expose any urls', function () {
        expect(updateUrls).to.deep.equal({})
      })
    })

    describe('when called without update steps', function () {
      beforeEach(function () {
        move = { id: 'moveId', move_type: 'hospital' }
        canAccess.returns(true)
        updateUrls = getUpdateUrls(move, canAccess)
      })
      it('should not expose any urls', function () {
        expect(updateUrls).to.deep.equal({})
      })
    })
  })
})
