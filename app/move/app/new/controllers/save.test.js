const Sentry = require('@sentry/node')
const { capitalize } = require('lodash')

const analytics = require('../../../../../common/lib/analytics')
const filters = require('../../../../../config/nunjucks/filters')
const shouldSaveCourtHearingsField = require('../fields/should-save-court-hearings')

const BaseController = require('./base')
const Controller = require('./save')

const controller = new Controller({ route: '/' })

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
  person: {
    id: '3333',
    _fullname: 'Full name',
  },
  profile: {
    id: '5555',
    person: {
      id: '6666',
      _fullname: 'Full name',
    },
  },
}
const mockDocuments = [
  {
    id: 'document_1',
  },
]

const mockValues = {
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
    id: '__person_1__',
    first_names: 'Steve',
    last_name: 'Smith',
  },
  profile: {
    id: '__profile_3__',
    person: {
      id: '__person_1__',
      first_names: 'Steve',
      last_name: 'Smith',
    },
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
  documents: mockDocuments,
}

describe('Move controllers', function () {
  describe('Save', function () {
    describe('#saveValues()', function () {
      let req,
        nextSpy,
        courtHearingService,
        profileService,
        perService,
        moveService

      beforeEach(function () {
        const journeyGetStub = sinon.stub()
        journeyGetStub
          .withArgs('history')
          .returns([{ foo: 'bar' }, { fizz: 'buzz' }])
          .withArgs('lastVisited')
          .returns('/foo')

        sinon
          .stub(BaseController.prototype, 'requiresYouthAssessment')
          .returns(true)
        courtHearingService = {
          create: sinon.stub().resolvesArg(0),
        }
        profileService = {
          update: sinon.stub().resolves({}),
        }
        perService = {
          create: sinon.stub().resolves({}),
        }
        moveService = {
          create: sinon.stub().resolves(mockMove),
        }
        nextSpy = sinon.spy()
        req = {
          form: {
            values: {},
            options: {
              journeyName: 'mock-journey-a369bd4e-09da-40fc-bd26-f41c0d695557',
            },
          },
          journeyModel: { get: journeyGetStub },
          sessionModel: {
            set: sinon.stub(),
            toJSON: () => mockValues,
          },
          services: {
            courtHearing: courtHearingService,
            profile: profileService,
            personEscortRecord: perService,
            move: moveService,
          },
        }
      })

      context('when move save is successful', function () {
        context('when the profile already has a PER', function () {
          beforeEach(async function () {
            req = {
              ...req,
              sessionModel: {
                ...req.sessionModel,
                toJSON: () => ({
                  ...mockValues,
                  profile: {
                    ...mockValues.profile,
                    person_escort_record: { it: 'exists' },
                  },
                }),
              },
            }
            await controller.saveValues(req, {}, nextSpy)
          })

          it('does not create a PER', function () {
            expect(perService.create).not.to.be.called
          })
        })

        context('when the profile does not yet have a PER', function () {
          beforeEach(async function () {
            req = {
              ...req,
              sessionModel: {
                ...req.sessionModel,
                toJSON: () => ({
                  ...mockValues,
                  profile: {
                    ...mockValues.profile,
                    person_escort_record: null,
                  },
                }),
              },
            }
            await controller.saveValues(req, {}, nextSpy)
          })

          it('creates a new PER', function () {
            expect(perService.create).to.be.calledOnceWithExactly(mockMove.id)
          })
        })

        context('without court hearings', function () {
          beforeEach(async function () {
            await controller.saveValues(req, {}, nextSpy)
          })

          it('should filter out correct properties', function () {
            expect(moveService.create).to.be.calledWith({
              reference: '',
              to_location: 'Court',
              from_location: 'Prison',
              person: mockValues.person,
              profile: mockValues.profile,
            })
          })

          it('should patch profile', function () {
            expect(profileService.update).to.be.calledOnceWithExactly({
              ...mockValues.profile,
              requires_youth_risk_assessment: true,
              assessment_answers: mockValues.assessment,
              documents: mockValues.documents,
            })
          })

          it('should not call court hearing service', function () {
            expect(courtHearingService.create).not.to.called
          })

          it('should set move to session model', function () {
            expect(req.sessionModel.set).to.be.calledWith('move', mockMove)
          })

          it('should not throw an error', function () {
            expect(nextSpy).to.be.calledOnce
            expect(nextSpy).to.be.calledWith()
          })
        })

        context('with court hearings', function () {
          const mockValuesWithHearings = {
            ...mockValues,
            court_hearings: [
              {
                start_time: '2020-04-20T10:00:00+01:00',
                case_number: '12345678',
                case_start_date: '2020-04-20',
                case_type: 'Adult',
                comments: '',
                nomis_case_id: 1563156,
              },
              {
                start_time: '2020-04-22T10:00:00+01:00',
                case_number: '98765432',
                case_start_date: '2018-04-22',
                case_type: 'Youth',
                comments: '',
                nomis_case_id: 98765432,
              },
            ],
          }

          context('by default', function () {
            beforeEach(async function () {
              req.sessionModel.toJSON = () => mockValuesWithHearings
              await controller.saveValues(req, {}, nextSpy)
            })

            it('should filter out correct properties', function () {
              expect(moveService.create).to.be.calledWith({
                reference: '',
                to_location: 'Court',
                from_location: 'Prison',
                person: mockValues.person,
                profile: mockValues.profile,
                court_hearings: mockValuesWithHearings.court_hearings,
              })
            })

            it('should patch profile', function () {
              expect(profileService.update).to.be.calledOnceWithExactly({
                ...mockValuesWithHearings.profile,
                requires_youth_risk_assessment: true,
                assessment_answers: mockValuesWithHearings.assessment,
                documents: mockValuesWithHearings.documents,
              })
            })

            it('should call court hearing service correct number of times', function () {
              expect(courtHearingService.create.callCount).to.equal(
                mockValuesWithHearings.court_hearings.length
              )
            })

            it('should call court hearing service with correct arguments', function () {
              expect(courtHearingService.create).to.be.calledWithExactly(
                {
                  ...mockValuesWithHearings.court_hearings[0],
                  move: mockMove.id,
                },
                false
              )
              expect(courtHearingService.create).to.be.calledWithExactly(
                {
                  ...mockValuesWithHearings.court_hearings[1],
                  move: mockMove.id,
                },
                false
              )
            })

            it('should set move to session model', function () {
              expect(req.sessionModel.set).to.be.calledWith('move', mockMove)
            })

            it('should not throw an error', function () {
              expect(nextSpy).to.be.calledOnce
              expect(nextSpy).to.be.calledWith()
            })
          })

          context('when user has selected to NOT save to NOMIS', function () {
            const shouldSaveCourtHearingsFalseValue =
              shouldSaveCourtHearingsField.items[1].value

            beforeEach(async function () {
              req.sessionModel.toJSON = () => {
                return {
                  ...mockValuesWithHearings,
                  should_save_court_hearings: shouldSaveCourtHearingsFalseValue,
                }
              }

              await controller.saveValues(req, {}, nextSpy)
            })

            it('should filter out correct properties', function () {
              expect(moveService.create).to.be.calledWith({
                reference: '',
                to_location: 'Court',
                from_location: 'Prison',
                person: mockValuesWithHearings.person,
                profile: mockValuesWithHearings.profile,
                court_hearings: mockValuesWithHearings.court_hearings,
                should_save_court_hearings: shouldSaveCourtHearingsFalseValue,
              })
            })

            it('should call court hearing service correct number of times', function () {
              expect(courtHearingService.create.callCount).to.equal(
                mockValuesWithHearings.court_hearings.length
              )
            })

            it('should call court hearing service with correct arguments', function () {
              expect(courtHearingService.create).to.be.calledWithExactly(
                {
                  ...mockValuesWithHearings.court_hearings[0],
                  move: mockMove.id,
                },
                true
              )
              expect(courtHearingService.create).to.be.calledWithExactly(
                {
                  ...mockValuesWithHearings.court_hearings[1],
                  move: mockMove.id,
                },
                true
              )
            })
          })
        })

        context('without person ID on profile person', function () {
          const mockValuesWithoutProfile = {
            ...mockValues,
            profile: {
              id: '12345',
              foo: 'bar',
            },
          }

          beforeEach(async function () {
            sinon.stub(Sentry, 'captureException')
            sinon.stub(Sentry, 'setContext')

            req.sessionModel.toJSON = () => mockValuesWithoutProfile

            await controller.saveValues(req, {}, nextSpy)
          })

          it('should filter out correct properties', function () {
            expect(moveService.create).to.be.calledWith({
              reference: '',
              to_location: 'Court',
              from_location: 'Prison',
              person: mockValues.person,
              profile: {
                id: '12345',
                foo: 'bar',
              },
            })
          })

          it('should not patch profile', function () {
            expect(profileService.update).not.to.be.called
          })

          it('should send warning to sentry', function () {
            expect(Sentry.captureException).to.be.calledOnce
          })

          it('should send move data to sentry', function () {
            expect(Sentry.setContext).to.be.calledWithExactly('Move data', {
              'Move ID': mockMove.id,
              'Person ID': mockMove.person.id,
              'Profile ID': mockMove.profile.id,
              'Profile -> Person ID': mockMove.profile.person.id,
            })
          })

          it('should send session data to sentry', function () {
            expect(Sentry.setContext).to.be.calledWithExactly('Session data', {
              'Person ID': mockValuesWithoutProfile.person.id,
              'Profile ID': mockValuesWithoutProfile.profile.id,
              'Profile -> Person ID': undefined,
            })
          })

          it('should send journey data to sentry', function () {
            expect(Sentry.setContext).to.be.calledWithExactly('Journey', {
              'Original name': req.form.options.journeyName,
              'Normalised name': 'mock_journey',
              history: '[{"foo":"bar"},{"fizz":"buzz"}]',
              lastVisited: '/foo',
            })
          })
        })
      })

      context('when move save fails', function () {
        const errorMock = new Error('Problem')

        beforeEach(async function () {
          req.services.move.create = sinon.stub().throws(errorMock)
          await controller.saveValues(req, {}, nextSpy)
        })

        it('should not save move to session model', function () {
          expect(req.sessionModel.set).not.to.be.called
        })

        it('should call next with the error', function () {
          expect(nextSpy).to.be.calledWith(errorMock)
        })

        it('should call next once', function () {
          expect(nextSpy).to.be.calledOnce
        })

        it('should not save court hearings', function () {
          expect(courtHearingService.create).not.to.be.called
        })
      })

      context('when profile update fails', function () {
        const errorMock = new Error('Problem')

        beforeEach(async function () {
          profileService.update.throws(errorMock)
          await controller.saveValues(req, {}, nextSpy)
        })

        it('should save move to session model', function () {
          expect(req.sessionModel.set).to.be.calledWith('move', mockMove)
        })

        it('should call next with the error', function () {
          expect(nextSpy).to.be.calledWith(errorMock)
        })

        it('should call next once', function () {
          expect(nextSpy).to.be.calledOnce
        })
      })
    })

    describe('#process()', function () {
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

      beforeEach(function () {
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

      context('when from location is not Prison', function () {
        beforeEach(function () {
          controller.process(req, {}, {})
        })

        it('should save flattened assessment from form values', function () {
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

        it('should call parent process method', function () {
          expect(
            BaseController.prototype.process
          ).to.have.been.calledOnceWithExactly(req, {}, {})
        })
      })

      context('when from location is Prison', function () {
        beforeEach(function () {
          req.form.values.from_location_type = 'prison'
        })

        context('without NOMIS imported assessment answers', function () {
          context(
            'with `not_to_be_released` and `special_vehicle`',
            function () {
              beforeEach(function () {
                req.getProfile = sinon
                  .stub()
                  .returns({ assessment_answers: [] })
                req.form.values.assessment = mockCurrentAssessmentWithExplicit
                controller.process(req, {}, {})
              })

              it('should save assessment', function () {
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

              it('should call parent process method', function () {
                expect(
                  BaseController.prototype.process
                ).to.have.been.calledOnceWithExactly(req, {}, {})
              })
            }
          )

          context(
            'without `not_to_be_released` and `special_vehicle`',
            function () {
              beforeEach(function () {
                req.getProfile = sinon
                  .stub()
                  .returns({ assessment_answers: [] })
                controller.process(req, {}, {})
              })

              it('should save assessment from form values', function () {
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

              it('should call parent process method', function () {
                expect(
                  BaseController.prototype.process
                ).to.have.been.calledOnceWithExactly(req, {}, {})
              })
            }
          )
        })

        context('with NOMIS imported assessment answers', function () {
          beforeEach(function () {
            req.form.values.person.assessment_answers = mockExistingAssessment
          })

          context(
            'with `not_to_be_released` and `special_vehicle`',
            function () {
              beforeEach(function () {
                req.getProfile = sinon
                  .stub()
                  .returns({ assessment_answers: mockExistingAssessment })
                req.form.values.assessment = mockCurrentAssessmentWithExplicit
                controller.process(req, {}, {})
              })

              it('should save assessment and retain NOMIS answers', function () {
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

              it('should call parent process method', function () {
                expect(
                  BaseController.prototype.process
                ).to.have.been.calledOnceWithExactly(req, {}, {})
              })
            }
          )

          context(
            'without `not_to_be_released` and `special_vehicle`',
            function () {
              beforeEach(function () {
                req.getProfile = sinon
                  .stub()
                  .returns({ assessment_answers: mockExistingAssessment })
                req.form.values.assessment =
                  mockCurrentAssessmentWithoutExplicit
                controller.process(req, {}, {})
              })

              it('should save assessment but exclude `not_to_be_released` and `special_vehicle` NOMIS answers', function () {
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

              it('should call parent process method', function () {
                expect(
                  BaseController.prototype.process
                ).to.have.been.calledOnceWithExactly(req, {}, {})
              })
            }
          )
        })

        context('when to location is also Prison', function () {
          beforeEach(function () {
            req.getProfile = sinon.stub().returns({ assessment_answers: [] })
            req.form.values.to_location_type = 'prison'
            controller.process(req, {}, {})
          })
          it('will create a status of proposed on the move', function () {
            expect(req.sessionModel.set).to.have.been.calledWithExactly(
              'status',
              'proposed'
            )
          })
        })
      })
    })

    describe('#successHandler()', function () {
      let req, res, nextSpy

      beforeEach(function () {
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

        sinon.stub(analytics, 'sendJourneyTime')
      })

      context('by default', function () {
        const mockJourneyTimestamp = 12345
        const mockCurrentTimestamp = new Date('2017-08-10').getTime()
        const mockFromLocationType = 'police'

        beforeEach(async function () {
          this.clock = sinon.useFakeTimers(mockCurrentTimestamp)
          analytics.sendJourneyTime.resolves({})
          req.sessionModel.get.withArgs('move').returns(mockMove)
          req.sessionModel.get
            .withArgs('journeyTimestamp')
            .returns(mockJourneyTimestamp)
            .withArgs('from_location_type')
            .returns(mockFromLocationType)
          await controller.successHandler(req, res, nextSpy)
        })

        afterEach(function () {
          this.clock.restore()
        })

        it('should send journey time to analytics', function () {
          expect(analytics.sendJourneyTime).to.be.calledOnceWithExactly({
            utv: capitalize(req.form.options.name),
            utt: mockCurrentTimestamp - mockJourneyTimestamp,
            utc: capitalize(mockFromLocationType),
          })
        })

        it('should reset the journey', function () {
          expect(req.journeyModel.reset).to.have.been.calledOnce
        })

        it('should reset the session', function () {
          expect(req.sessionModel.reset).to.have.been.calledOnce
        })

        it('should redirect correctly', function () {
          expect(res.redirect).to.have.been.calledOnce
          expect(res.redirect).to.have.been.calledWith(
            `/move/${mockMove.id}/confirmation`
          )
        })

        it('should not call next', function () {
          expect(nextSpy).not.to.have.been.called
        })
      })

      context('when journey contains UUID', function () {
        const mockJourneyTimestamp = 12345
        const mockCurrentTimestamp = new Date('2017-08-10').getTime()
        const mockFromLocationType = 'police'

        beforeEach(async function () {
          this.clock = sinon.useFakeTimers(mockCurrentTimestamp)
          analytics.sendJourneyTime.resolves({})
          req.sessionModel.get.withArgs('move').returns(mockMove)
          req.sessionModel.get
            .withArgs('journeyTimestamp')
            .returns(mockJourneyTimestamp)
            .withArgs('from_location_type')
            .returns(mockFromLocationType)
          req.form.options.name =
            'create-a-move-507b0fc0-6972-428c-bfc6-d26028de61ae'
          await controller.successHandler(req, res, nextSpy)
        })

        afterEach(function () {
          this.clock.restore()
        })

        it('should remove the UUID from timing variable', function () {
          const args = analytics.sendJourneyTime.args[0][0]
          expect(args).to.have.property('utv')
          expect(args.utv).to.equal('Create-a-move')
        })
      })

      context('when send journey time fails', function () {
        const mockError = new Error('Error')

        beforeEach(async function () {
          analytics.sendJourneyTime.rejects(mockError)
          req.sessionModel.get.withArgs('move').returns(mockMove)
          req.sessionModel.get.withArgs('journeyTimestamp').returns(12345)
          await controller.successHandler(req, res, nextSpy)
        })

        it('should not redirect', function () {
          expect(res.redirect).not.to.have.been.called
        })

        it('should call next with error', function () {
          expect(nextSpy).to.have.been.calledOnceWithExactly(mockError)
        })
      })
    })

    describe('#errorHandler()', function () {
      let reqMock, resMock, errorMock, nextSpy

      beforeEach(function () {
        sinon.stub(Sentry, 'setContext')
        sinon.stub(filters, 'formatDateWithDay').returnsArg(0)
        sinon.stub(BaseController.prototype, 'errorHandler')
        nextSpy = sinon.spy()
        errorMock = new Error()
        reqMock = {
          sessionModel: {
            toJSON: sinon.stub().returns({
              date: '2020-10-10',
              person: {
                _fullname: 'DOE, JOHN',
                id: '105e849c-b4d6-47dd-b697-779c0d7109bf',
              },
              profile: {
                id: '4f7bca27-c34e-4c82-806b-80dc3f77ae21',
                person: {
                  id: '3b1ec8e4-74bc-4781-8e19-09964cb49334',
                  _fullname: 'DOE, JOHN',
                },
              },
              to_location: {
                title: 'BRIXTON',
              },
            }),
            get: sinon.stub().withArgs('move').returns(mockMove),
          },
          t: sinon.stub().returnsArg(0),
        }
        resMock = {
          render: sinon.spy(),
        }
      })

      context('with non validation error', function () {
        beforeEach(function () {
          errorMock.statusCode = 500
          controller.errorHandler(errorMock, reqMock, resMock, nextSpy)
        })

        it('should send extra data to Sentry', function () {
          expect(Sentry.setContext).to.have.been.calledWithExactly(
            'Move data',
            {
              'Move ID': mockMove.id,
              'Person ID': mockMove.person.id,
              'Profile ID': mockMove.profile.id,
              'Profile -> Person ID': mockMove.profile.person.id,
            }
          )
          expect(Sentry.setContext).to.have.been.calledWithExactly(
            'Session data',
            {
              'Person ID': '105e849c-b4d6-47dd-b697-779c0d7109bf',
              'Profile ID': '4f7bca27-c34e-4c82-806b-80dc3f77ae21',
              'Profile -> Person ID': '3b1ec8e4-74bc-4781-8e19-09964cb49334',
            }
          )
        })

        it('should call parent error handler', function () {
          expect(
            BaseController.prototype.errorHandler
          ).to.have.been.calledOnceWithExactly(
            errorMock,
            reqMock,
            resMock,
            nextSpy
          )
        })

        it('should not render a template', function () {
          expect(resMock.render).not.to.have.been.called
        })
      })

      context('with validation error', function () {
        const mockExistingMoveId = '12345'

        beforeEach(function () {
          errorMock.statusCode = 422
        })

        context('with `taken` error code', function () {
          context('with to location', function () {
            beforeEach(function () {
              errorMock.errors = [
                {
                  code: 'taken',
                  meta: {
                    existing_id: mockExistingMoveId,
                  },
                },
              ]
              controller.errorHandler(errorMock, reqMock, resMock, nextSpy)
            })

            it('should not send extra data to Sentry', function () {
              expect(Sentry.setContext).not.to.have.been.called
            })

            it('should not call parent error handler', function () {
              expect(BaseController.prototype.errorHandler).not.to.have.been
                .called
            })

            it('should render a template', function () {
              expect(resMock.render).to.have.been.calledOnceWithExactly(
                'action-prevented',
                {
                  pageTitle: 'validation::move_conflict.heading',
                  message: 'validation::move_conflict.message',
                  instruction: 'validation::move_conflict.instructions',
                }
              )
            })

            it('should translate page title', function () {
              expect(reqMock.t).to.have.been.calledWithExactly(
                'validation::move_conflict.heading'
              )
            })

            it('should translate message', function () {
              expect(reqMock.t).to.have.been.calledWithExactly(
                'validation::move_conflict.message',
                {
                  href: '/move/12345',
                  name: 'DOE, JOHN',
                  location: 'BRIXTON',
                  date: '2020-10-10',
                }
              )
            })

            it('should translate instruction', function () {
              expect(reqMock.t).to.have.been.calledWithExactly(
                'validation::move_conflict.instructions',
                {
                  date_href: 'move-date/edit',
                  location_href: 'move-details/edit',
                }
              )
            })
          })

          context('with prison recall', function () {
            beforeEach(function () {
              reqMock.sessionModel.toJSON.returns({
                date: '2020-10-10',
                person: {
                  _fullname: 'DOE, JOHN',
                },
              })
              errorMock.errors = [
                {
                  code: 'taken',
                  meta: {
                    existing_id: mockExistingMoveId,
                  },
                },
              ]
              controller.errorHandler(errorMock, reqMock, resMock, nextSpy)
            })

            it('should not send extra data to Sentry', function () {
              expect(Sentry.setContext).not.to.have.been.called
            })

            it('should not call parent error handler', function () {
              expect(BaseController.prototype.errorHandler).not.to.have.been
                .called
            })

            it('should render a template', function () {
              expect(resMock.render).to.have.been.calledOnceWithExactly(
                'action-prevented',
                {
                  pageTitle: 'validation::move_conflict.heading',
                  message: 'validation::move_conflict.message',
                  instruction: 'validation::move_conflict.instructions',
                }
              )
            })

            it('should translate page title', function () {
              expect(reqMock.t).to.have.been.calledWithExactly(
                'validation::move_conflict.heading'
              )
            })

            it('should translate message', function () {
              expect(reqMock.t).to.have.been.calledWithExactly(
                'validation::move_conflict.message',
                {
                  href: '/move/12345',
                  name: 'DOE, JOHN',
                  location: 'fields::move_type.items.prison_recall.label',
                  date: '2020-10-10',
                }
              )
            })

            it('should translate instruction', function () {
              expect(reqMock.t).to.have.been.calledWithExactly(
                'validation::move_conflict.instructions',
                {
                  date_href: 'move-date/edit',
                  location_href: 'move-details/edit',
                }
              )
              expect(reqMock.t).to.have.been.calledWithExactly(
                'fields::move_type.items.prison_recall.label'
              )
            })
          })
        })

        context('with any other error code', function () {
          beforeEach(function () {
            controller.errorHandler(errorMock, reqMock, resMock, nextSpy)
          })

          it('should send extra data to Sentry', function () {
            expect(Sentry.setContext).to.have.been.calledWithExactly(
              'Move data',
              {
                'Move ID': mockMove.id,
                'Person ID': mockMove.person.id,
                'Profile ID': mockMove.profile.id,
                'Profile -> Person ID': mockMove.profile.person.id,
              }
            )
            expect(Sentry.setContext).to.have.been.calledWithExactly(
              'Session data',
              {
                'Person ID': '105e849c-b4d6-47dd-b697-779c0d7109bf',
                'Profile ID': '4f7bca27-c34e-4c82-806b-80dc3f77ae21',
                'Profile -> Person ID': '3b1ec8e4-74bc-4781-8e19-09964cb49334',
              }
            )
          })

          it('should call parent error handler', function () {
            expect(
              BaseController.prototype.errorHandler
            ).to.have.been.calledOnceWithExactly(
              errorMock,
              reqMock,
              resMock,
              nextSpy
            )
          })

          it('should not render a template', function () {
            expect(resMock.render).not.to.have.been.called
          })
        })
      })

      context('without session model data', function () {
        beforeEach(function () {
          reqMock.sessionModel.toJSON.returns()
          reqMock.sessionModel.get.withArgs('move').returns()
          errorMock.statusCode = 500
          controller.errorHandler(errorMock, reqMock, resMock, nextSpy)
        })

        it('should send empty data to Sentry', function () {
          expect(Sentry.setContext).to.have.been.calledWithExactly(
            'Move data',
            {
              'Move ID': undefined,
              'Person ID': undefined,
              'Profile ID': undefined,
              'Profile -> Person ID': undefined,
            }
          )
          expect(Sentry.setContext).to.have.been.calledWithExactly(
            'Session data',
            {
              'Person ID': undefined,
              'Profile ID': undefined,
              'Profile -> Person ID': undefined,
            }
          )
        })
      })
    })
  })
})
