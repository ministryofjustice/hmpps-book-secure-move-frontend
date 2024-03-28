import { expect } from 'chai'
import sinon from 'sinon'

import { BasmRequest } from '../../../../../../common/types/basm_request'
import { BasmResponse } from '../../../../../../common/types/basm_response'
import { BasmRequestFactory } from '../../../../../../factories/basm_request'
import { LocationFactory } from '../../../../../../factories/location'
import { LodgingFactory } from '../../../../../../factories/lodging'
import { MoveFactory } from '../../../../../../factories/move'
import steps from '../steps'

import { BaseController } from './base'
import { itBehavesLikeALodgingEditController } from './base.test'
import { SetLocationController } from './set-location'

describe('set lodging location controller', function () {
  let controller: any
  const location = LocationFactory.build()
  const lodging = LodgingFactory.build({
    location,
    start_date: '2024-01-01',
  })
  const lodgingService = {
    create: sinon.stub().resolves(lodging),
  }
  let req: BasmRequest
  let res: BasmResponse
  let nextSpy: sinon.SinonSpy
  const referenceDataStub = {
    getLocationById: sinon.stub(),
  }

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
      set: sinon.stub(),
      toJSON: () => ({
        to_location_lodge: location.id,
      }),
    },
    journeyModel: {
      reset: sinon.stub(),
    },
    services: {
      lodging: lodgingService,
      referenceData: referenceDataStub,
    },
    move: MoveFactory.build({ date: '2054-01-01' }),
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

    BaseController.prototype.middlewareSetup = sinon.stub()
    controller = new SetLocationController({ route: '/' })

    sinon.stub(controller, 'use')
  })

  describe('#successHandler', function () {
    context('when the location is found', function () {
      beforeEach(function () {
        referenceDataStub.getLocationById.resolves(location)
      })

      it('sets the location in the session model', async function () {
        await controller.successHandler(req, res, nextSpy)

        expect(req.sessionModel.set).to.have.been.calledWithExactly(
          'to_location_lodge',
          location
        )
      })
    })

    context('when the creation fails', function () {
      const errorMock = new Error('404')

      beforeEach(async function () {
        referenceDataStub.getLocationById.throws(errorMock)
        await controller.successHandler(req, res, nextSpy)
      })

      it('should call next with the error', function () {
        expect(nextSpy).to.have.been.calledWith(errorMock)
      })
    })
  })

  itBehavesLikeALodgingEditController(SetLocationController)
})
