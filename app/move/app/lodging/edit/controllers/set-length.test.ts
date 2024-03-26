import { expect } from 'chai'
import { formatISO, parseISO } from 'date-fns'
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
import { SetLengthController } from './set-length'

describe('set lodging length controller', function () {
  let controller: any
  const location = LocationFactory.build()
  const lodging = LodgingFactory.build({
    location,
    start_date: '2024-01-01',
  })
  let req: BasmRequest
  let res: BasmResponse
  let nextSpy: sinon.SinonSpy

  const reqDefaults = () => ({
    lodging,
    form: {
      options: {
        fields: {},
        next: '/',
        steps,
      },
      values: {},
    },
    sessionModel: {
      attributes: {
        lodge_start_date: lodging.start_date,
      },
      reset: sinon.stub(),
      set: sinon.stub(),
    },
    journeyModel: {
      reset: sinon.stub(),
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
    controller = new SetLengthController({ route: '/' })

    sinon.stub(controller, 'use')
  })

  describe('#setAdditionalLocals', function () {
    it('should call setAdditionalLocals middleware', function () {
      controller.middlewareSetup(req, res, nextSpy)

      expect(controller.use.firstCall).to.have.been.calledWith(
        controller.setAdditionalLocals
      )
    })

    it('sets the lodge location in locals', function () {
      controller.setAdditionalLocals(req, res, nextSpy)

      expect(res.locals.lodgeLocation).to.deep.equal(location)
    })

    it('sets the lodge start date in locals', function () {
      controller.setAdditionalLocals(req, res, nextSpy)

      expect(formatISO(res.locals.lodgeStartDate)).to.equal(
        '2024-01-01T00:00:00Z'
      )
    })
  })

  describe('#process', function () {
    context('when standard lodge length', function () {
      beforeEach(function () {
        req.form = {
          options: {
            fields: {},
            next: '/',
            steps,
          },
          values: {
            lodge_length_type: '1',
          },
        }
      })

      it('sets the lodge length', function () {
        controller.process(req, res, nextSpy)

        expect(req.form?.values.lodge_length).to.equal(1)
      })
    })

    context('when custom lodge length', function () {
      beforeEach(function () {
        req.form = {
          options: {
            fields: {},
            next: '/',
            steps,
          },
          values: {
            lodge_length_type: 'custom',
            lodge_length_custom: '3',
          },
        }
      })

      it('sets the lodge length', function () {
        controller.process(req, res, nextSpy)

        expect(req.form?.values.lodge_length).to.equal(3)
      })
    })
  })

  itBehavesLikeALodgingEditController(SetLengthController)
})
