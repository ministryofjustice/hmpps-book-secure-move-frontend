import { expect } from 'chai'
import sinon from 'sinon'

import { BasmRequest } from '../../../../../../common/types/basm_request'
import { BasmResponse } from '../../../../../../common/types/basm_response'
import { Move } from '../../../../../../common/types/move'
import { BasmRequestFactory } from '../../../../../../factories/basm_request'
import { LodgingFactory } from '../../../../../../factories/lodging'
import { MoveFactory } from '../../../../../../factories/move'
import steps from '../steps'

import { BaseController } from './base'

export const itBehavesLikeALodgingEditController = (
  ControllerClass: typeof BaseController
) => {
  describe('edit lodging base controller', function () {
    let controller: BaseController
    const lodging = LodgingFactory.build({ start_date: '2024-01-01' })
    const lodgingService = {
      create: sinon.stub().resolves(lodging),
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
        values: {
          lodge_length: 2,
        },
      },
      sessionModel: {
        attributes: {
          to_location_lodge: lodging.location,
          lodge_start_date: lodging.start_date,
        },
        reset: sinon.stub(),
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
                next: '/save',
                steps,
              },
            },
          })
          controller.setButtonText(req, res, nextSpy)
        })

        it('sets the correct button text', function () {
          expect(req?.form?.options.buttonText).to.equal(
            'actions::save_and_continue'
          )
        })
      })

      context('when specified in form options', function () {
        beforeEach(function () {
          req = BasmRequestFactory.build({
            ...reqDefaults(),
            form: {
              options: {
                fields: {},
                next: '/',
                steps,
                buttonText: 'custom:text',
              },
            },
          })
          controller.setButtonText(req, res, nextSpy)
        })

        it('sets the correct button text', function () {
          expect(req?.form?.options.buttonText).to.equal('custom:text')
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
            req.move = {
              ...move,
              status,
            }
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
            req.move = {
              ...move,
              status,
            }
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

    describe('#errorHandler', function () {
      const err = {
        errors: [
          {
            code: 'taken',
          },
        ],
        statusCode: 422,
      }
      const profile = { person: { _fullname: 'Reginald Carothers' } }
      const move = MoveFactory.build({ profile })

      beforeEach(function () {
        req.move = move
      })

      it('renders the error correctly', function () {
        controller.errorHandler(err, req, res, nextSpy)
        expect(res.render).to.have.been.calledWith('action-prevented', {
          backLink: `/move/${move.id}`,
          pageTitle: 'This lodging cannot be created',
          message:
            'A lodging already exists for <strong>Reginald Carothers</strong> on <strong>Saturday 1 Jan 2022</strong>.',
        })
      })
    })
  })
}

itBehavesLikeALodgingEditController(BaseController)
