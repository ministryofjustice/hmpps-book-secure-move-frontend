const moveService = require('../../common/services/move')

const middleware = require('./middleware')

const moveStub = {
  data: [
    { foo: 'bar' },
    { fizz: 'buzz' },
  ],
}
const movesStub = [
  { foo: 'bar' },
  { fizz: 'buzz' },
]
const mockMoveId = '6904dea1-017f-48d8-a5ad-2723dee9d146'
const errorStub = new Error('Problem')

describe('Moves middleware', function () {
  describe('#setMove()', function () {
    context('when no move ID exists', function () {
      let res, nextSpy

      beforeEach(async function () {
        sinon.stub(moveService, 'getMoveById').resolves(moveStub)

        res = { locals: {} }
        nextSpy = sinon.spy()

        await middleware.setMove({}, res, nextSpy)
      })

      it('should call next with no argument', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it('should not call API with move ID', function () {
        expect(moveService.getMoveById).not.to.be.called
      })

      it('should not set response data to locals object', function () {
        expect(res.locals).not.to.have.property('move')
      })
    })

    context('when move ID exists', function () {
      context('when API call returns succesfully', function () {
        let res, nextSpy

        beforeEach(async function () {
          sinon.stub(moveService, 'getMoveById').resolves(moveStub)

          res = { locals: {} }
          nextSpy = sinon.spy()

          await middleware.setMove({}, res, nextSpy, mockMoveId)
        })

        it('should call API with move ID', function () {
          expect(moveService.getMoveById).to.be.calledWith(mockMoveId)
        })

        it('should set response data to locals object', function () {
          expect(res.locals).to.have.property('move')
          expect(res.locals.move).to.equal(moveStub.data)
        })

        it('should call next with no argument', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when API call returns an error', function () {
        let res, nextSpy

        beforeEach(async function () {
          sinon.stub(moveService, 'getMoveById').throws(errorStub)

          res = { locals: {} }
          nextSpy = sinon.spy()

          await middleware.setMove({}, res, nextSpy, mockMoveId)
        })

        it('should not set a value on the locals object', function () {
          expect(res.locals).not.to.have.property('move')
        })

        it('should send error to next function', function () {
          expect(nextSpy).to.be.calledOnceWithExactly(errorStub)
        })
      })
    })
  })

  describe('#setMoveDate()', function () {
    let req, res, nextSpy

    beforeEach(function () {
      res = { locals: {} }
      nextSpy = sinon.spy()
    })

    context('when no move date exists in query', function () {
      const mockDate = '2019-08-10'

      beforeEach(function () {
        this.clock = sinon.useFakeTimers(new Date(mockDate).getTime())

        req = { query: {} }

        middleware.setMoveDate(req, res, nextSpy)
      })

      afterEach(function () {
        this.clock.restore()
      })

      it('should set move date to current date', function () {
        expect(res.locals).to.have.property('moveDate')
        expect(res.locals.moveDate).to.equal('2019-08-10')
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when move date exists in query', function () {
      beforeEach(function () {
        req = {
          query: {
            'move-date': '2019-10-10',
          },
        }

        middleware.setMoveDate(req, res, nextSpy)
      })

      it('should set move date to query value', function () {
        expect(res.locals).to.have.property('moveDate')
        expect(res.locals.moveDate).to.equal('2019-10-10')
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })

  describe('#setMovesByDate()', function () {
    let res, nextSpy

    beforeEach(async function () {
      sinon.stub(moveService, 'getRequestedMovesByDate')
      nextSpy = sinon.spy()
      res = { locals: {} }
    })

    context('when no move date exists', function () {
      beforeEach(async function () {
        await middleware.setMovesByDate({}, res, nextSpy)
      })

      it('should call next with no argument', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })

      it('should not call API with move date', function () {
        expect(moveService.getRequestedMovesByDate).not.to.be.called
      })

      it('should not set response data to locals object', function () {
        expect(res.locals).not.to.have.property('movesByDate')
      })
    })

    context('when move date exists', function () {
      beforeEach(function () {
        res = {
          locals: {
            moveDate: '2010-10-10',
          },
        }
      })

      context('when API call returns succesfully', function () {
        beforeEach(async function () {
          moveService.getRequestedMovesByDate.resolves(movesStub)
          await middleware.setMovesByDate({}, res, nextSpy)
        })

        it('should call API with move ID', function () {
          expect(moveService.getRequestedMovesByDate).to.be.calledWith(res.locals.moveDate)
        })

        it('should set response to locals object', function () {
          expect(res.locals).to.have.property('movesByDate')
          expect(res.locals.movesByDate).to.equal(movesStub)
        })

        it('should call next with no argument', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when API call returns an error', function () {
        beforeEach(async function () {
          moveService.getRequestedMovesByDate.throws(errorStub)
          await middleware.setMovesByDate({}, res, nextSpy)
        })

        it('should not set a value on the locals object', function () {
          expect(res.locals).not.to.have.property('movesByDate')
        })

        it('should send error to next function', function () {
          expect(nextSpy).to.be.calledOnceWithExactly(errorStub)
        })
      })
    })
  })
})
