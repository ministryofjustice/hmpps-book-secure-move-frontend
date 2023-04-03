const controller = require('./controllers')

describe('Police Custody Form controllers', function () {
  describe('#addEvents', function () {
    const eventService = {
      postLockoutEvents: sinon.stub(),
    }

    const locals = {
      showErrorsSummary: undefined,
      formErrors: undefined,
      formData: undefined,
    }

    context('when save is successful', function () {
      const mockReq = {
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
          events: ['PerViolentDangerous'],
        },
        user: {},
      }
      mockReq.services = { event: eventService }
      const mockRes = {
        redirect: sinon.stub(),
        locals,
      }

      beforeEach(async function () {
        await controller.addEvents(mockReq, mockRes)
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
      const mockReq = {
        move: {
          id: '12232552242',
        },
        body: {
          events: undefined,
        },
        user: {},
      }
      mockReq.services = { event: eventService }
      const mockRes = {
        render: sinon.stub(),
        locals,
      }

      beforeEach(async function () {
        await controller.addEvents(mockReq, mockRes)
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
      const mockReq = {
        move: {
          id: '12232552242',
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
        user: {},
      }
      mockReq.services = { event: eventService }

      const mockRes = {
        render: sinon.stub(),
        locals,
      }

      beforeEach(async function () {
        await controller.addEvents(mockReq, mockRes)
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
