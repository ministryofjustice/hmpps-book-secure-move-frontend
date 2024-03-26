import { expect } from 'chai'
import sinon from 'sinon'

import { BasmRequest } from '../../../../../../common/types/basm_request'
import { BasmResponse } from '../../../../../../common/types/basm_response'
import { Move } from '../../../../../../common/types/move'
import { BasmRequestFactory } from '../../../../../../factories/basm_request'
import { MoveFactory } from '../../../../../../factories/move'
import steps from '../steps'

import { BaseController } from './base'

export const itBehavesLikeALodgingCancelController = (
  ControllerClass: typeof BaseController
) => {
  describe('cancel lodging base controller', function () {
    let controller: BaseController
    const lodgingService = {
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

      controller = new ControllerClass({ route: '/' })
    })

    describe('#setButtonText', function () {
      beforeEach(function () {
        controller.setButtonText(req, res, nextSpy)
      })

      it('sets the correct button text', function () {
        expect(req?.form?.options.buttonText).to.equal('actions::continue')
      })

      it('should call next', function () {
        expect(nextSpy).to.have.been.calledOnce
      })

      context('when final step', function () {
        beforeEach(function () {
          req = BasmRequestFactory.build({
            ...reqDefaults(),
            form: {
              options: {
                fields: {},
                next: '/cancel',
                steps,
              },
            },
          })
          controller.setButtonText(req, res, nextSpy)
        })

        it('sets the correct button text', function () {
          expect(req?.form?.options.buttonText).to.equal(
            'actions::confirm_cancel_lodge'
          )
        })
      })
    })

    describe('#canEdit', function () {
      const move = MoveFactory.build()

      const badStatuses: Move['status'][] = ['completed', 'cancelled']
      const goodStatuses: Move['status'][] = [
        'requested',
        'proposed',
        'booked',
        'in_transit',
      ]

      badStatuses.forEach(status =>
        context(`with move status of ${status}`, function () {
          beforeEach(function () {
            req.move = { ...move, status }
            controller.canEdit(req, res, nextSpy)
          })

          it('redirects to the move details page', function () {
            expect(res.redirect).to.have.been.calledWith(`/move/${req.move.id}`)
          })

          it('does not call next', function () {
            expect(nextSpy).not.to.have.been.called
          })
        })
      )

      goodStatuses.forEach(status =>
        context(`with move status of ${status}`, function () {
          beforeEach(function () {
            req.move = { ...move, status }
            controller.canEdit(req, res, nextSpy)
          })

          it('does not redirect', function () {
            expect(res.redirect).not.to.have.been.called
          })

          it('should call next', function () {
            expect(nextSpy).to.have.been.calledOnce
          })
        })
      )
    })
  })
}

itBehavesLikeALodgingCancelController(BaseController)
