const controller = require('./controllers')

describe('Police Custody Form controllers', function () {
  describe('#addEvents', function () {
    const moveService = {
      getById: sinon.stub(),
    }

    const eventService = {
      postEvents: sinon.stub(),
    }

    context('when save is successful', function () {
      const mockReq = {
        session: {
          errors: null,
        },
        body: {
          moveId: '12232552242',
          events: ['PerViolentDangerous'],
        },
        user: {},
      }
      mockReq.services = { move: moveService, event: eventService }
      const mockRes = {
        redirect: sinon.stub(),
      }

      beforeEach(async function () {
        await controller.addEvents(mockReq, mockRes)
      })

      it('should redirect to the timeline/events page for that move', function () {
        expect(mockRes.redirect).to.be.calledOnceWithExactly(
          'move/12232552242/timeline'
        )
      })
    })

    context('when no events are chosen', function () {
      const mockReq = {
        session: {
          errors: null,
          showErrorsSummary: undefined,
        },
        body: {
          moveId: '12232552242',
          events: undefined,
        },
        user: {},
      }
      mockReq.services = { move: moveService, event: eventService }
      const mockRes = {
        redirect: sinon.stub(),
      }

      beforeEach(async function () {
        await controller.addEvents(mockReq, mockRes)
      })

      it('should redirect back to the police custody form to fill in the form', function () {
        expect(mockRes.redirect).to.be.calledOnceWithExactly(
          'move/12232552242/police-custody-form'
        )
      })

      it('sets the req.session.showErrorsSummary to true', function () {
        expect(mockReq.session.showErrorsSummary).to.be.true
      })
    })

    context('when there are form errors', function () {
      const mockReq = {
        session: {
          errors: [],
          showErrorsSummary: undefined,
          formData: null,
        },
        body: {
          events: ['PerViolentDangerous', 'PerGeneric'],
          PerViolentDangerous: '',
          PerWeapons: '',
          PerConcealed: '',
          PerSelfHarm: '',
          PerEscape: '',
          PersonMoveUsedForce: '',
          PerMedicalAid1: '',
          PerMedicalDrugsAlcohol: '',
          PerMedicalAid2: '',
          PerMedicalMentalHealth: '',
          PerPropertyChange: '',
          PersonMoveDeathInCustody: '',
          PerGeneric: '',
          moveId: '12232552242',
        },
        user: {},
      }
      mockReq.services = { move: moveService, event: eventService }

      const mockRes = {
        redirect: sinon.stub(),
      }

      beforeEach(async function () {
        await controller.addEvents(mockReq, mockRes)
      })

      it('should redirect back to the police custody form to fill in the form', function () {
        expect(mockRes.redirect).to.be.calledOnceWithExactly(
          'move/12232552242/police-custody-form'
        )
      })

      it('sets the req.session.showErrorsSummary to true', function () {
        expect(mockReq.session.showErrorsSummary).to.be.true
      })

      it('sets the req.session.errors error and message for the view', function () {
        expect(mockReq.session.errors[0].error).to.be.eq('PerViolentDangerous')
        expect(mockReq.session.errors[0].message).to.be.eq(
          'Enter details of any violence that has taken place'
        )

        expect(mockReq.session.errors[1].error).to.be.eq('PerGeneric')
        expect(mockReq.session.errors[1].message).to.be.eq(
          'Enter details of any other events'
        )
      })

      it('sets the req.session.formData to prepopulate for fields', function () {
        expect(mockReq.session.formData).to.be.eq(mockReq.body)
      })
    })
  })
})
