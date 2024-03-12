import sinon from "sinon"
import { SetLengthController } from "./set-length"
import { BasmRequest } from "../../../../../../common/types/basm_request"
import { BasmResponse } from "../../../../../../common/types/basm_response"
import { BasmRequestFactory } from "../../../../../../factories/basm_request"
import { expect } from "chai"
import steps from '../steps'
import { LodgingFactory } from "../../../../../../factories/lodging"
import { itBehavesLikeALodgingNewController } from "./base.test"
import { BaseController } from "./base"
import { LocationFactory } from "../../../../../../factories/location"
import { MoveFactory } from "../../../../../../factories/move"
import { formatISO, parseISO } from "date-fns"

describe('set lodging length controller', () => {
  let controller: any
  let location = LocationFactory.build()
  const lodging = LodgingFactory.build({ location, start_date: '2024-01-01' })
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
      values: {},
    },
    sessionModel: {
      attributes:{
        to_location_lodge: lodging.location,
        lodge_start_date: lodging.start_date,
      },
      reset: sinon.stub(),
      set: sinon.stub(),
    },
    journeyModel: {
      reset: sinon.stub(),
    },
    services: {
      lodging: lodgingService,
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

  describe('#setAdditionalLocals', function() {
    it('should call setAdditionalLocals middleware', function () {
      controller.middlewareSetup(req, res, nextSpy)

      expect(controller.use.firstCall).to.have.been.calledWith(
        controller.setAdditionalLocals
      )
    })

    it('sets the lodge location in locals', function() {
      controller.setAdditionalLocals(req, res, nextSpy)

      expect(res.locals.lodgeLocation).to.deep.equal(location)
    })

    it('sets the lodge start date in locals', function() {
      controller.setAdditionalLocals(req, res, nextSpy)
      
      expect(formatISO(res.locals.lodgeStartDate)).to.equal('2054-01-01T00:00:00Z')
    })

    it('sets the lodge start date in the session model', function() {
      controller.setAdditionalLocals(req, res, nextSpy)
      
      expect(req.sessionModel.set).to.have.been.calledWith('lodge_start_date', parseISO('2054-01-01T00:00:00Z'))
    })
  })

  describe('#process', function() {
    context('when standard lodge length', function() {
      beforeEach(function() {
        req.form = {
          options: {
            fields: {},
            next: '/',
            steps,
          },
          values: {
            lodge_length_type: '1',
          }
        }
      })

      it('sets the lodge length', function() {
        controller.process(req, res, nextSpy)
  
        expect(req.form?.values.lodge_length).to.equal(1)
      })
    })

    context('when custom lodge length', function() {
      beforeEach(function() {
        req.form = {
          options: {
            fields: {},
            next: '/',
            steps,
          },
          values: {
            lodge_length_type: 'custom',
            lodge_length_custom: '3',
          }
        }
      })

      it('sets the lodge length', function() {
        controller.process(req, res, nextSpy)
  
        expect(req.form?.values.lodge_length).to.equal(3)
      })
    })
  })

  itBehavesLikeALodgingNewController(SetLengthController)
})