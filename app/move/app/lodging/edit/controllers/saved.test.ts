import { expect } from 'chai'
import sinon from 'sinon'

import { BasmRequest } from '../../../../../../common/types/basm_request'
import { BasmResponse } from '../../../../../../common/types/basm_response'
import { BasmRequestFactory } from '../../../../../../factories/basm_request'
import { LocationFactory } from '../../../../../../factories/location'
import { LodgingFactory } from '../../../../../../factories/lodging'
import { MoveFactory } from '../../../../../../factories/move'
import steps from '../steps'

import { SavedController } from './saved'

describe('lodging saved controller', function () {
  const lodging = LodgingFactory.build({
    start_date: '2024-01-01',
    end_date: '2024-01-03',
  })
  const lodgingService = {
    create: sinon.stub().resolves(lodging),
  }
  let req: BasmRequest
  let res: BasmResponse
  let nextSpy: sinon.SinonSpy
  const location = LocationFactory.build()

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
      referenceData: {
        getLocationById: sinon.stub().resolves(location),
      },
    },
  })

  const profile = { person: { _fullname: 'Fred' } }

  beforeEach(function () {
    nextSpy = sinon.spy()

    req = BasmRequestFactory.build(reqDefaults())

    res = {
      locals: {},
      redirect: sinon.stub(),
      render: sinon.stub(),
    }

    nextSpy = sinon.spy()
  })

  context('with a matching lodging', function () {
    beforeEach(function () {
      req.move = MoveFactory.build({
        lodgings: [lodging],
        profile,
      })
      req.params.lodgingId = lodging.id
    })

    it('renders the page with the correct data', async function () {
      await SavedController(req, res, nextSpy)
      expect(res.render).to.have.been.calledWithExactly(
        'move/app/lodging/edit/views/saved',
        {
          moveReference: 'ABC1234D',
          location: location.title,
          dateText:
            'between <strong>Monday 1 Jan 2024</strong> and <strong>Wednesday 3 Jan 2024</strong>',
          move: req.move,
          name: 'Fred',
        }
      )
    })
  })

  context('without a matching lodging', function () {
    beforeEach(function () {
      req.move = MoveFactory.build({
        lodgings: [lodging],
        profile,
      })
      req.params.lodgingId = 'bad_id'
    })

    it('calls next with a 404 error', async function () {
      await SavedController(req, res, nextSpy)
      expect(nextSpy.firstCall.firstArg.message).to.equal('Lodging not found')
    })
  })
})
