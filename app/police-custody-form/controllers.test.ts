import sinon from "sinon"
import { addEvents } from './controllers'
import { SessionModel } from '../../common/types/session_model'
import { LodgingService } from '../../common/services/lodging'
import { SupplierService } from '../../common/services/supplier'
import { EventService } from '../../common/services/event'
import { BasmRequest } from "../../common/types/basm_request"
import { expect } from "chai"
import { BasmResponse } from "../../common/types/basm_response"

describe('Police Custody Form controllers', function () {
  describe('#addEvents', function () {
    let mockReq: BasmRequest 
    let mockRes: BasmResponse
    let eventService: EventService

    beforeEach(() => {

      const mockSessionModel = {
        attributes: {},
        allocation: undefined,
        reset: sinon.stub(),
        set: sinon.stub(),
        toJSON: sinon.stub(),
      }

      eventService = {
        postLockoutEvents: sinon.stub(),
        getEvent: sinon.stub(),
        postEvent: sinon.stub(),
        req: sinon.stub(),
        apiClient: sinon.stub(),
        removeInvalid: sinon.stub(),
      } as unknown as EventService

      mockReq = {
        t: sinon.stub().returnsArg(0),
        flash: sinon.stub(),
        move: {
          id: '12232552242',
          profile: {
            person: {
              _fullname: 'Barry, Garlow',
            },
          },
        },
        body: {
          events: ['PerViolentDangerous', 'PerGeneric'],
          PerViolentDangerous: '',
          PerWeapons: '',
          PerConcealed: '',
          PerSelfHarm: '',
          PerEscape: '',
          PersonMoveUsedForce: '',
          PerMedicalAid: '',
          PerMedicalDrugsAlcohol: '',
          PerMedicalMedication: '',
          PerMedicalMentalHealth: '',
          PerPropertyChange: '',
          PersonMoveDeathInCustody: '',
          PerGeneric: '',
        },
        allocation: undefined,
        canAccess: sinon.stub().returns(true),
        form: {
          options: {
            fields: {},
            next: '',
          },
          values: {},
        },
        initialStep: null,
        journeyModel: mockSessionModel as SessionModel,
        journeys: [],
        lodging: undefined,
        params: {},
        session: {
          save: sinon.stub(),
        },
        sessionModel: mockSessionModel as SessionModel,
        services: {
          allocation: sinon.stub(),
          lodging: sinon.createStubInstance(LodgingService),
          supplier: sinon.createStubInstance(SupplierService),
          event: eventService,
        },
        user: {
          id: 'user-123',
          permissions: [],
        },
      } as unknown as BasmRequest

      mockRes = {
        locals: {
          cancelUrl: undefined,
        },
        render: sinon.stub(),
        redirect: sinon.stub(),
        breadcrumb: undefined,
      } as BasmResponse

    })

    const locals = {
      showErrorsSummary: undefined,
      formErrors: undefined,
      formData: undefined,
    }

    context('when save is successful', function () {
      beforeEach(async function () {
        await addEvents(mockReq, mockRes)
      })

      it('should redirect to the timeline/events page for that move', function () {
        expect(mockRes.redirect).to.be.calledOnceWithExactly(
          '/move/12232552242'
        )
      })

      it('should render the success flash banner', function () {
        expect(mockReq.flash).to.have.been.calledWithExactly('success', {
          title: 'messages::events_added.heading',
          content: 'messages::events_added.content',
        })
      })
    })

    context('when no events are chosen', function () {
      beforeEach(async function () {
        await addEvents(mockReq, mockRes)
      })

      it('should render the police custody form to fill in the form', function () {
        expect(mockRes.render).to.be.calledOnceWithExactly(
          'police-custody-form/police-custody-form'
        )
      })

      it('sets the req.session.showErrorsSummary to true', function () {
        expect(mockRes.locals.showErrorsSummary).to.be.true
      })
    })

    context('when there are form errors', function () {

      beforeEach(async function () {
        await addEvents(mockReq, mockRes)
      })

      it('should render the police custody form to fill in the form', function () {
        expect(mockRes.render).to.be.calledOnceWithExactly(
          'police-custody-form/police-custody-form'
        )
      })

      it('sets the req.session.showErrorsSummary to true', function () {
        expect(mockRes.locals.showErrorsSummary).to.be.true
      })

      it('sets the req.session.errors error and message for the view', function () {
        expect(mockRes.locals.formErrors[0].error).to.be.eq(
          'PerViolentDangerous'
        )
        expect(mockRes.locals.formErrors[0].message).to.be.eq(
          'Enter details of any violence that has taken place'
        )

        expect(mockRes.locals.formErrors[1].error).to.be.eq('PerGeneric')
        expect(mockRes.locals.formErrors[1].message).to.be.eq(
          'Enter details of any other events'
        )
      })

      it('sets the req.session.formData to prepopulate for fields', function () {
        expect(mockRes.locals.formData).to.be.eq(mockReq.body)
      })
    })
  })
})
