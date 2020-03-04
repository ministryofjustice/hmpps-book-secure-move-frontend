const { capitalize } = require('lodash')
const proxyquire = require('proxyquire')

const BaseController = require('./base')
const Controller = proxyquire('./save', {
  '../../../moves': {
    mountpath: '/moves',
  },
})
const moveService = require('../../../../common/services/move')
const personService = require('../../../../common/services/person')
const analytics = require('../../../../common/lib/analytics')
const filters = require('../../../../config/nunjucks/filters')

const controller = new Controller({ route: '/' })

const mockPerson = {
  id: '3333',
  fullname: 'Full name',
}
const mockMove = {
  id: '4444',
  date: '2019-10-10',
  to_location: {
    title: 'To location',
    location_type: 'court',
  },
  from_location: {
    location_type: 'police',
  },
  person: mockPerson,
}
const valuesMock = {
  'csrf-secret': 'secret',
  errors: null,
  errorValues: {
    reference: '',
    to_location: 'Court',
    from_location: 'Prison',
  },
  reference: '',
  to_location: 'Court',
  from_location: 'Prison',
  person: {
    first_names: 'Steve',
    last_name: 'Smith',
  },
  assessment: {
    court: [
      {
        assessment_question_id: '2222',
        comments: '',
      },
    ],
    risk: [
      {
        assessment_question_id: '1111',
        comments: 'Good climber',
      },
    ],
    health: [
      {
        assessment_question_id: '4444',
        comments: 'Health issue',
      },
      {
        assessment_question_id: '3333',
        comments: '',
      },
      {
        assessment_question_id: '5555',
        comments: 'Needs bigger car',
      },
    ],
  },
}

describe('Move controllers', function() {
  describe('Save', function() {
    describe('#saveValues()', function() {
      let req, nextSpy

      beforeEach(function() {
        nextSpy = sinon.spy()
        req = {
          form: {
            values: {},
          },
          sessionModel: {
            set: sinon.stub(),
            toJSON: () => valuesMock,
          },
        }
      })

      context('when move save is successful', function() {
        beforeEach(async function() {
          sinon.stub(moveService, 'create').resolves(mockMove)
          sinon.stub(personService, 'update').resolves(mockPerson)
          await controller.saveValues(req, {}, nextSpy)
        })

        it('should filter out correct properties', function() {
          expect(moveService.create).to.be.calledWith({
            reference: '',
            to_location: 'Court',
            from_location: 'Prison',
            person: {
              first_names: 'Steve',
              last_name: 'Smith',
            },
            assessment: valuesMock.assessment,
          })
        })

        it('should call person update', function() {
          expect(personService.update).to.be.calledOnceWithExactly({
            ...valuesMock.person,
            assessment_answers: valuesMock.assessment,
          })
        })

        it('should set response to session model', function() {
          expect(req.sessionModel.set).to.be.calledWith('move', mockMove)
        })

        it('should not throw an error', function() {
          expect(nextSpy).to.be.calledOnce
          expect(nextSpy).to.be.calledWith()
        })
      })

      context('when save fails', function() {
        const errorMock = new Error('Problem')

        beforeEach(async function() {
          sinon.stub(moveService, 'create').throws(errorMock)
          await controller.saveValues(req, {}, nextSpy)
        })

        it('should call next with the error', function() {
          expect(nextSpy).to.be.calledWith(errorMock)
        })

        it('should call next once', function() {
          expect(nextSpy).to.be.calledOnce
        })

        it('should not set person response on form values', function() {
          expect(req.form.values).not.to.have.property('person')
        })
      })
    })

    describe('#process()', function() {
      let req
      const mockCurrentAssessmentWithoutExplicit = {
        court: [
          {
            key: 'other_court',
            assessment_question_id: '80ca9b7f-a260-4406-a3af-17e190bdc714',
            comments: 'Other court details',
          },
        ],
        risk: [
          {
            key: 'escape',
            assessment_question_id: '3174ebe6-0ab3-4f08-afa6-ff7b04cc215b',
            comments: 'Likely to escape',
          },
        ],
        health: [
          {
            key: 'health_issue',
            assessment_question_id: 'cbb6d55e-bbde-4928-baa0-a9156b45bcef',
            comments: 'Recurring health issue',
          },
        ],
      }
      const mockCurrentAssessmentWithExplicit = {
        court: [
          {
            key: 'other_court',
            assessment_question_id: '80ca9b7f-a260-4406-a3af-17e190bdc714',
            comments: 'Other court details',
          },
        ],
        risk: [
          {
            key: 'escape',
            assessment_question_id: '3174ebe6-0ab3-4f08-afa6-ff7b04cc215b',
            comments: 'Likely to escape',
          },
          {
            key: 'not_to_be_released',
            assessment_question_id: 'a3534a54-d3a9-46c7-a1f0-de7e762ca95a',
            comments: '',
          },
        ],
        health: [
          {
            key: 'health_issue',
            assessment_question_id: 'cbb6d55e-bbde-4928-baa0-a9156b45bcef',
            comments: 'Recurring health issue',
          },
          {
            key: 'special_vehicle',
            assessment_question_id: '16566785-a75f-4b8a-8da8-180ec4c615df',
            comments: '',
          },
        ],
      }
      const mockExistingAssessment = [
        {
          key: 'self_harm',
          comments: 'History of self harm',
          assessment_question_id: '4e7e54b4-a40c-488f-bdff-c6b2268ca4eb',
          category: 'risk',
          nomis_alert_type: 'H',
          nomis_alert_code: 'HA',
          nomis_alert_type_description: 'Self Harm',
          nomis_alert_description: 'ACCT Open (HMPS)',
          imported_from_nomis: true,
        },
        {
          key: 'violent',
          assessment_question_id: 'af8cfc67-757c-4019-9d5e-618017de1617',
          category: 'risk',
          nomis_alert_type: 'X',
          nomis_alert_code: 'XB',
          nomis_alert_type_description: 'Security',
          nomis_alert_description: 'Bully',
          imported_from_nomis: true,
        },
        {
          key: 'not_to_be_released',
          assessment_question_id: 'a3534a54-d3a9-46c7-a1f0-de7e762ca95a',
          category: 'risk',
          nomis_alert_type: 'X',
          nomis_alert_code: 'XNR',
          nomis_alert_type_description: 'Security',
          nomis_alert_description: 'Not For Release (NFR)',
          imported_from_nomis: true,
        },
        {
          key: 'health_issue',
          assessment_question_id: 'cbb6d55e-bbde-4928-baa0-a9156b45bcef',
          comments: 'Recurring health issue',
          nomis_alert_type: 'M',
          nomis_alert_code: 'MAS',
          nomis_alert_type_description: 'Medical',
          nomis_alert_description: 'Asthmatic',
          imported_from_nomis: true,
        },
        {
          key: 'special_vehicle',
          assessment_question_id: '16566785-a75f-4b8a-8da8-180ec4c615df',
          nomis_alert_type: 'M',
          nomis_alert_code: 'MFL',
          nomis_alert_type_description: 'Medical',
          nomis_alert_description: 'False limbs',
          imported_from_nomis: true,
        },
      ]

      beforeEach(function() {
        sinon.stub(BaseController.prototype, 'process')
        req = {
          form: {
            values: {
              assessment: mockCurrentAssessmentWithoutExplicit,
              person: {
                assessment_answers: [],
              },
            },
          },
          sessionModel: {
            get: sinon.stub(),
            set: sinon.stub(),
          },
        }
      })

      context('when from location is not Prison', function() {
        beforeEach(function() {
          controller.process(req, {}, {})
        })

        it('should save flattened assessment from form values', function() {
          expect(req.sessionModel.set).to.be.calledOnceWithExactly(
            'assessment',
            [
              {
                key: 'other_court',
                assessment_question_id: '80ca9b7f-a260-4406-a3af-17e190bdc714',
                comments: 'Other court details',
              },
              {
                key: 'escape',
                assessment_question_id: '3174ebe6-0ab3-4f08-afa6-ff7b04cc215b',
                comments: 'Likely to escape',
              },
              {
                key: 'health_issue',
                assessment_question_id: 'cbb6d55e-bbde-4928-baa0-a9156b45bcef',
                comments: 'Recurring health issue',
              },
            ]
          )
        })

        it('should call parent process method', function() {
          expect(
            BaseController.prototype.process
          ).to.have.been.calledOnceWithExactly(req, {}, {})
        })
      })

      context('when from location is Prison', function() {
        beforeEach(function() {
          req.form.values.from_location_type = 'prison'
        })

        context('without NOMIS imported assessment answers', function() {
          context(
            'with `not_to_be_released` and `special_vehicle`',
            function() {
              beforeEach(function() {
                req.form.values.assessment = mockCurrentAssessmentWithExplicit
                controller.process(req, {}, {})
              })

              it('should save assessment', function() {
                expect(req.sessionModel.set).to.be.calledOnceWithExactly(
                  'assessment',
                  [
                    {
                      key: 'other_court',
                      assessment_question_id:
                        '80ca9b7f-a260-4406-a3af-17e190bdc714',
                      comments: 'Other court details',
                    },
                    {
                      key: 'escape',
                      assessment_question_id:
                        '3174ebe6-0ab3-4f08-afa6-ff7b04cc215b',
                      comments: 'Likely to escape',
                    },
                    {
                      key: 'not_to_be_released',
                      assessment_question_id:
                        'a3534a54-d3a9-46c7-a1f0-de7e762ca95a',
                      comments: '',
                    },
                    {
                      key: 'health_issue',
                      assessment_question_id:
                        'cbb6d55e-bbde-4928-baa0-a9156b45bcef',
                      comments: 'Recurring health issue',
                    },
                    {
                      key: 'special_vehicle',
                      assessment_question_id:
                        '16566785-a75f-4b8a-8da8-180ec4c615df',
                      comments: '',
                    },
                  ]
                )
              })

              it('should call parent process method', function() {
                expect(
                  BaseController.prototype.process
                ).to.have.been.calledOnceWithExactly(req, {}, {})
              })
            }
          )

          context(
            'without `not_to_be_released` and `special_vehicle`',
            function() {
              beforeEach(function() {
                controller.process(req, {}, {})
              })

              it('should save assessment from form values', function() {
                expect(req.sessionModel.set).to.be.calledOnceWithExactly(
                  'assessment',
                  [
                    {
                      key: 'other_court',
                      assessment_question_id:
                        '80ca9b7f-a260-4406-a3af-17e190bdc714',
                      comments: 'Other court details',
                    },
                    {
                      key: 'escape',
                      assessment_question_id:
                        '3174ebe6-0ab3-4f08-afa6-ff7b04cc215b',
                      comments: 'Likely to escape',
                    },
                    {
                      key: 'health_issue',
                      assessment_question_id:
                        'cbb6d55e-bbde-4928-baa0-a9156b45bcef',
                      comments: 'Recurring health issue',
                    },
                  ]
                )
              })

              it('should call parent process method', function() {
                expect(
                  BaseController.prototype.process
                ).to.have.been.calledOnceWithExactly(req, {}, {})
              })
            }
          )
        })

        context('with NOMIS imported assessment answers', function() {
          beforeEach(function() {
            req.form.values.person.assessment_answers = mockExistingAssessment
          })

          context(
            'with `not_to_be_released` and `special_vehicle`',
            function() {
              beforeEach(function() {
                req.form.values.assessment = mockCurrentAssessmentWithExplicit
                controller.process(req, {}, {})
              })

              it('should save assessment and retain NOMIS answers', function() {
                expect(req.sessionModel.set).to.be.calledOnceWithExactly(
                  'assessment',
                  [
                    ...mockExistingAssessment,
                    {
                      key: 'other_court',
                      assessment_question_id:
                        '80ca9b7f-a260-4406-a3af-17e190bdc714',
                      comments: 'Other court details',
                    },
                    {
                      key: 'escape',
                      assessment_question_id:
                        '3174ebe6-0ab3-4f08-afa6-ff7b04cc215b',
                      comments: 'Likely to escape',
                    },
                    {
                      key: 'not_to_be_released',
                      assessment_question_id:
                        'a3534a54-d3a9-46c7-a1f0-de7e762ca95a',
                      comments: '',
                    },
                    {
                      key: 'health_issue',
                      assessment_question_id:
                        'cbb6d55e-bbde-4928-baa0-a9156b45bcef',
                      comments: 'Recurring health issue',
                    },
                    {
                      key: 'special_vehicle',
                      assessment_question_id:
                        '16566785-a75f-4b8a-8da8-180ec4c615df',
                      comments: '',
                    },
                  ]
                )
              })

              it('should call parent process method', function() {
                expect(
                  BaseController.prototype.process
                ).to.have.been.calledOnceWithExactly(req, {}, {})
              })
            }
          )

          context(
            'without `not_to_be_released` and `special_vehicle`',
            function() {
              beforeEach(function() {
                req.form.values.assessment = mockCurrentAssessmentWithoutExplicit
                controller.process(req, {}, {})
              })

              it('should save assessment but exclude `not_to_be_released` and `special_vehicle` NOMIS answers', function() {
                expect(req.sessionModel.set).to.be.calledOnceWithExactly(
                  'assessment',
                  [
                    {
                      key: 'self_harm',
                      comments: 'History of self harm',
                      assessment_question_id:
                        '4e7e54b4-a40c-488f-bdff-c6b2268ca4eb',
                      category: 'risk',
                      nomis_alert_type: 'H',
                      nomis_alert_code: 'HA',
                      nomis_alert_type_description: 'Self Harm',
                      nomis_alert_description: 'ACCT Open (HMPS)',
                      imported_from_nomis: true,
                    },
                    {
                      key: 'violent',
                      assessment_question_id:
                        'af8cfc67-757c-4019-9d5e-618017de1617',
                      category: 'risk',
                      nomis_alert_type: 'X',
                      nomis_alert_code: 'XB',
                      nomis_alert_type_description: 'Security',
                      nomis_alert_description: 'Bully',
                      imported_from_nomis: true,
                    },
                    {
                      key: 'health_issue',
                      assessment_question_id:
                        'cbb6d55e-bbde-4928-baa0-a9156b45bcef',
                      comments: 'Recurring health issue',
                      nomis_alert_type: 'M',
                      nomis_alert_code: 'MAS',
                      nomis_alert_type_description: 'Medical',
                      nomis_alert_description: 'Asthmatic',
                      imported_from_nomis: true,
                    },
                    {
                      key: 'other_court',
                      assessment_question_id:
                        '80ca9b7f-a260-4406-a3af-17e190bdc714',
                      comments: 'Other court details',
                    },
                    {
                      key: 'escape',
                      assessment_question_id:
                        '3174ebe6-0ab3-4f08-afa6-ff7b04cc215b',
                      comments: 'Likely to escape',
                    },
                    {
                      key: 'health_issue',
                      assessment_question_id:
                        'cbb6d55e-bbde-4928-baa0-a9156b45bcef',
                      comments: 'Recurring health issue',
                    },
                  ]
                )
              })

              it('should call parent process method', function() {
                expect(
                  BaseController.prototype.process
                ).to.have.been.calledOnceWithExactly(req, {}, {})
              })
            }
          )
        })
      })
    })

    describe('#successHandler()', function() {
      let req, res, nextSpy

      beforeEach(function() {
        req = {
          form: {
            values: {},
            options: {
              name: 'create-move',
            },
          },
          sessionModel: {
            get: sinon.stub(),
            reset: sinon.stub(),
          },
          journeyModel: {
            reset: sinon.stub(),
          },
        }
        res = {
          redirect: sinon.stub(),
        }
        nextSpy = sinon.stub()

        sinon.stub(filters, 'formatDateWithDay').returnsArg(0)
        sinon.stub(analytics, 'sendJourneyTime')
      })

      context('by default', function() {
        const mockJourneyTimestamp = 12345
        const mockCurrentTimestamp = new Date('2017-08-10').getTime()

        beforeEach(async function() {
          this.clock = sinon.useFakeTimers(mockCurrentTimestamp)
          analytics.sendJourneyTime.resolves({})
          req.sessionModel.get.withArgs('move').returns(mockMove)
          req.sessionModel.get
            .withArgs('journeyTimestamp')
            .returns(mockJourneyTimestamp)
          await controller.successHandler(req, res, nextSpy)
        })

        it('should send journey time to analytics', function() {
          expect(analytics.sendJourneyTime).to.be.calledOnceWithExactly({
            utv: capitalize(req.form.options.name),
            utt: mockCurrentTimestamp - mockJourneyTimestamp,
            utc: capitalize(mockMove.from_location.location_type),
          })
        })

        it('should reset the journey', function() {
          expect(req.journeyModel.reset).to.have.been.calledOnce
        })

        it('should reset the session', function() {
          expect(req.sessionModel.reset).to.have.been.calledOnce
        })

        it('should redirect correctly', function() {
          expect(res.redirect).to.have.been.calledOnce
          expect(res.redirect).to.have.been.calledWith(
            `/move/${mockMove.id}/confirmation`
          )
        })

        it('should not call next', function() {
          expect(nextSpy).not.to.have.been.called
        })
      })

      context('when send journey time fails', function() {
        const mockError = new Error('Error')

        beforeEach(async function() {
          analytics.sendJourneyTime.rejects(mockError)
          req.sessionModel.get.withArgs('move').returns(mockMove)
          req.sessionModel.get.withArgs('journeyTimestamp').returns(12345)
          await controller.successHandler(req, res, nextSpy)
        })

        it('should not redirect', function() {
          expect(res.redirect).not.to.have.been.called
        })

        it('should call next with error', function() {
          expect(nextSpy).to.have.been.calledOnceWithExactly(mockError)
        })
      })
    })
  })
})
