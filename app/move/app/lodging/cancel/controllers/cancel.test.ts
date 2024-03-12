import sinon from "sinon"
import { CancelController } from "./cancel"
import { BasmRequest } from "../../../../../../common/types/basm_request"
import { BasmResponse } from "../../../../../../common/types/basm_response"
import { BasmRequestFactory } from "../../../../../../factories/basm_request"
import { expect } from "chai"
import steps from '../steps'
import { itBehavesLikeALodgingCancelController } from "./base.test"

describe('cancel lodging controller', () => {
  let controller: CancelController
  let lodgingService = {
    cancelAll: sinon.stub().resolves({}),
  }
  let req: BasmRequest
  let res: BasmResponse
  let nextSpy: sinon.SinonSpy

  const reqDefaults = () => ({
    form: {
      options: {
        fields: {},
        next: '/',
        steps,
      },
    },
    sessionModel: {
      reset: sinon.stub(),
      toJSON: () => ({
        'csrf-secret': '123',
        errors: {},
        errorValues: {},
        lodge_cancel_reason: 'other',
        lodge_cancel_reason_custom: 'Comment',
      }),
    },
    journeyModel: {
      reset: sinon.stub(),
    },
    services: {
      lodging: lodgingService,
    },
  })

  beforeEach(function () {
    nextSpy = sinon.spy()

    req = BasmRequestFactory.build(reqDefaults())

    res = {
      locals: {},
      redirect: sinon.stub(),
      render: sinon.stub(),
    }

    nextSpy = sinon.spy()

    controller = new CancelController({ route: '/' })
  })

  describe('#successHandler', function() {
    context('when the cancellation is successful', function() {
      beforeEach(async function() {
        await controller.successHandler(req, res, nextSpy)
      })

      it('cancels all lodgings for the move via the API', function() {
        expect(lodgingService.cancelAll).to.have.been.calledWithExactly(
          {
            moveId: req.move.id,
            reason: 'other',
            comment: 'Comment',
          }
        )
      })

      it('should reset the wizard journey', function () {
        expect(req.journeyModel.reset).to.have.been.calledOnce
      })

      it('should reset the session', function () {
        expect(req.sessionModel.reset).to.have.been.calledOnce
      })

      it('should redirect to the move details page', function () {
        expect(res.redirect).to.have.been.calledWith(`/move/${req.move.id}`)
      })
    })

    context('when the cancellation fails', function() {
      const errorMock = new Error('422')

      beforeEach(async function() {
        req.services.lodging.cancelAll = sinon.stub().throws(errorMock)
        await controller.successHandler(req, res, nextSpy)
      })

      it('should call next with the error', function () {
        expect(nextSpy).to.have.been.calledWith(errorMock)
      })
    })
  })

  itBehavesLikeALodgingCancelController(CancelController)
})