import sinon from "sinon"
import { BasmRequest } from "../../../../../../common/types/basm_request"
import { BasmResponse } from "../../../../../../common/types/basm_response"
import { BasmRequestFactory } from "../../../../../../factories/basm_request"
import { expect } from "chai"
import steps from '../steps'
import { SetReasonController } from "./set-reason"
import { BaseController } from "./base"
import { itBehavesLikeALodgingCancelController } from "./base.test"

describe('set reason controller', () => {
  let controller: any
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

  beforeEach(async function () {
    nextSpy = sinon.spy()

    req = BasmRequestFactory.build(reqDefaults())

    res = {
      locals: {},
      redirect: sinon.stub(),
      render: sinon.stub(),
    }

    nextSpy = sinon.spy()

    BaseController.prototype.middlewareSetup = sinon.stub()
    controller = new SetReasonController({ route: '/' })

    sinon.stub(controller, 'use')
  })

  describe('#setAdditionalLocals', function() {
    it('should call setAdditionalLocals middleware', function () {
      controller.middlewareSetup(req, res, nextSpy)

      expect(controller.use.firstCall).to.have.been.calledWith(
        controller.setAdditionalLocals
      )
    })

    it('sets additional locals', function() {
      controller.setAdditionalLocals(req, res, nextSpy)

      expect(res.locals.moveId).to.equal(req.move.id)
    })
  })

  itBehavesLikeALodgingCancelController(SetReasonController)
})