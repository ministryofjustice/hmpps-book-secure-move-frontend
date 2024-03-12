import sinon from "sinon"
import { SaveController } from "./save"
import { BasmRequest } from "../../../../../../common/types/basm_request"
import { BasmResponse } from "../../../../../../common/types/basm_response"
import { BasmRequestFactory } from "../../../../../../factories/basm_request"
import { expect } from "chai"
import steps from '../steps'
import { LodgingFactory } from "../../../../../../factories/lodging"
import { itBehavesLikeALodgingNewController } from "./base.test"

describe('save lodging controller', () => {
  let controller: SaveController
  const lodging = LodgingFactory.build({ start_date: '2024-01-01' })
  let lodgingService = {
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
      }
    },
    sessionModel: {
      attributes:{
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

    controller = new SaveController({ route: '/' })
  })

  describe('#successHandler', function() {
    context('when the lodging is successfully created', function() {
      beforeEach(async function() {
        await controller.successHandler(req, res, nextSpy)
      })

      it('creates all moves via the API', function() {
        expect(lodgingService.create).to.have.been.calledWithExactly(
          {
            moveId: req.move.id,
            locationId: lodging.location.id,
            startDate: '2024-01-01',
            endDate: '2024-01-03',
          }
        )
      })

      it('should redirect to the saved page', function () {
        expect(res.redirect).to.have.been.calledWith(`/move/${req.move.id}/lodging/new/${lodging.id}/saved`)
      })
    })

    context('when the creation fails', function() {
      const errorMock = new Error('422')

      beforeEach(async function() {
        req.services.lodging.create = sinon.stub().throws(errorMock)
        await controller.successHandler(req, res, nextSpy)
      })

      it('should call next with the error', function () {
        expect(nextSpy).to.have.been.calledWith(errorMock)
      })
    })
  })

  itBehavesLikeALodgingNewController(SaveController)
})