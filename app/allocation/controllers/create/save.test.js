const allocationService = require('../../../../common/services/allocation')

const Controller = require('./save')

const controller = new Controller({
  route: '/',
})

describe('the save controller', function () {
  let sessionModel
  let next
  const mockData = {
    'csrf-secret': '123',
    errors: [],
    answer1: 'yes',
    answer2: 34,
  }
  describe('#saveValues', function () {
    context('happy path', function () {
      beforeEach(async function () {
        sessionModel = {
          toJSON: sinon.stub().returns(mockData),
          set: sinon.stub(),
        }
        sinon.stub(allocationService, 'create').resolves({
          id: 9,
          allocationCreated: true,
        })
        next = sinon.stub()
        await controller.saveValues(
          {
            sessionModel,
          },
          {},
          next
        )
      })
      it('calls allocationService.create', function () {
        expect(allocationService.create).to.have.been.calledOnce
      })
      it('ignores the errors and csrf from session model', function () {
        expect(allocationService.create).to.have.been.calledWithExactly({
          answer1: 'yes',
          answer2: 34,
        })
      })
      it('sets the resulting allocation on the session model', function () {
        expect(sessionModel.set).to.have.been.calledWithExactly('allocation', {
          allocationCreated: true,
          id: 9,
        })
      })
      it('calls next', function () {
        expect(next).to.have.been.calledOnce
      })
    })
    context('unhappy path', function () {
      const error = new Error('bad!')
      beforeEach(async function () {
        sessionModel = {
          toJSON: sinon.stub().returns(mockData),
        }
        sinon.stub(allocationService, 'create').throws(error)
        next = sinon.stub()
        await controller.saveValues(
          {
            sessionModel,
          },
          {},
          next
        )
      })
      it('calls next with the error', function () {
        expect(next).to.be.calledOnceWithExactly(error)
      })
    })
  })
  describe('#successHandler', function () {
    let sessionModel
    let journeyModel
    let redirect
    context('happy path', function () {
      beforeEach(async function () {
        sessionModel = {
          toJSON: sinon.stub().returns(mockData),
          get: sinon.stub().returns(123),
          reset: sinon.stub(),
        }
        journeyModel = {
          reset: sinon.stub(),
        }
        redirect = sinon.stub()
        await controller.successHandler(
          {
            sessionModel,
            journeyModel,
          },
          { redirect },
          next
        )
      })
      it('resets the journey model', function () {
        expect(journeyModel.reset).to.have.been.calledOnce
      })
      it('resets the session model', function () {
        expect(sessionModel.reset).to.have.been.calledOnce
      })
      it('calls redirect', function () {
        expect(redirect).to.have.been.calledOnce
      })
    })
    context('unhappy path', function () {
      const error = new Error('error')
      beforeEach(async function () {
        next = sinon.stub()
        sessionModel = {
          get: sinon.stub().returns({
            id: 1,
          }),
        }
        await controller.successHandler(
          {
            sessionModel,
            journeyModel: {
              reset: sinon.stub().throws(error),
            },
          },
          {},
          next
        )
      })
      it('calls next with an error', function () {
        expect(next).to.have.been.calledWithExactly(error)
      })
    })
  })
})
