import { expect } from 'chai'
import { addDays, parseISO } from 'date-fns'
import sinon from 'sinon'

import { BasmRequest } from '../../../../../../common/types/basm_request'
import { BasmResponse } from '../../../../../../common/types/basm_response'
import { formatDate } from '../../../../../../config/nunjucks/filters'
import { BasmRequestFactory } from '../../../../../../factories/basm_request'
import { LodgingFactory } from '../../../../../../factories/lodging'
import steps from '../steps'

import { itBehavesLikeALodgingEditController } from './base.test'
import { SaveController } from './save'

describe('save edit lodging controller', function () {
  let controller: SaveController
  const lodging = LodgingFactory.build({ start_date: '2024-01-01' })
  const lodgingService = {
    update: sinon.stub().resolves(lodging),
  }
  let req: BasmRequest
  let res: BasmResponse
  let nextSpy: sinon.SinonSpy

  const reqDefaults = () => ({
    lodging: LodgingFactory.build(),
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

    controller = new SaveController({ route: '/' })
  })

  describe('#successHandler', function () {
    context('when the lodging is successfully edited', function () {
      beforeEach(async function () {
        await controller.successHandler(req, res, nextSpy)
      })

      it('edits the lodging via the API', function () {
        expect(lodgingService.update).to.have.been.calledWithExactly({
          moveId: req.move.id,
          id: req.lodging!.id,
          locationId: lodging.location.id,
          endDate: formatDate(
            addDays(parseISO(req.lodging!.start_date), 2),
            'yyyy-MM-dd'
          ),
        })
      })

      it('should redirect to the saved page', function () {
        expect(res.redirect).to.have.been.calledWith(
          `/move/${req.move.id}/lodging/${lodging.id}/edit/saved`
        )
      })
    })

    context('when the edit fails', function () {
      const errorMock = new Error('422')

      beforeEach(async function () {
        req.services.lodging.update = sinon.stub().throws(errorMock)
        await controller.successHandler(req, res, nextSpy)
      })

      it('should call next with the error', function () {
        expect(nextSpy).to.have.been.calledWith(errorMock)
      })
    })
  })

  itBehavesLikeALodgingEditController(SaveController)
})
