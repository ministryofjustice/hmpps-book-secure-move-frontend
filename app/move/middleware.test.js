const moveService = require('../../common/services/move')

const middleware = require('./middleware')

const moveStub = [{ foo: 'bar' }, { fizz: 'buzz' }]
const mockMoveId = '6904dea1-017f-48d8-a5ad-2723dee9d146'
const errorStub = new Error('Problem')

describe('Move middleware', function() {
  describe('#setMove()', function() {
    context('when no move ID exists', function() {
      let res, nextSpy

      beforeEach(async function() {
        sinon.stub(moveService, 'getById').resolves(moveStub)

        res = { locals: {} }
        nextSpy = sinon.spy()

        await middleware.setMove({}, res, nextSpy)
      })

      it('should call next with no argument', function() {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it('should not call API with move ID', function() {
        expect(moveService.getById).not.to.be.called
      })

      it('should not set response data to locals object', function() {
        expect(res.locals).not.to.have.property('move')
      })
    })

    context('when move ID exists', function() {
      context('when API call returns succesfully', function() {
        let res, nextSpy

        beforeEach(async function() {
          sinon.stub(moveService, 'getById').resolves(moveStub)

          res = { locals: {} }
          nextSpy = sinon.spy()

          await middleware.setMove({}, res, nextSpy, mockMoveId)
        })

        it('should call API with move ID', function() {
          expect(moveService.getById).to.be.calledWith(mockMoveId)
        })

        it('should set response data to locals object', function() {
          expect(res.locals).to.have.property('move')
          expect(res.locals.move).to.equal(moveStub)
        })

        it('should set moveId on locals object', function() {
          expect(res.locals.moveId).to.equal(mockMoveId)
        })

        it('should call next with no argument', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when API call returns an error', function() {
        let res, nextSpy

        beforeEach(async function() {
          sinon.stub(moveService, 'getById').throws(errorStub)

          res = { locals: {} }
          nextSpy = sinon.spy()

          await middleware.setMove({}, res, nextSpy, mockMoveId)
        })

        it('should not set a value on the locals object', function() {
          expect(res.locals).not.to.have.property('move')
        })

        it('should not set moveId on locals object', function() {
          expect(res.locals).not.to.have.property('moveId')
        })

        it('should send error to next function', function() {
          expect(nextSpy).to.be.calledOnceWithExactly(errorStub)
        })
      })
    })
  })
})
