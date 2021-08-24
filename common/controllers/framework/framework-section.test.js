const proxyquire = require('proxyquire')

const FormWizardController = require('../../../common/controllers/form-wizard')
const presenters = require('../../../common/presenters')
const i18n = require('../../../config/i18n')

const setMoveSummary = sinon.stub()

const Controller = proxyquire('./framework-section', {
  '../../middleware/set-move-summary': setMoveSummary,
})

const controller = new Controller({
  route: '/',
})

describe('Framework controllers', function () {
  describe('FrameworkSectionController', function () {
    describe('#middlewareLocals()', function () {
      beforeEach(function () {
        sinon.stub(FormWizardController.prototype, 'middlewareLocals')
        sinon.stub(controller, 'setSectionSummary')
        sinon.stub(controller, 'setMoveId')
        sinon.stub(controller, 'setEditableStatus')
        sinon.stub(controller, 'seti18nContext')
        sinon.stub(controller, 'setPagination')
        sinon.stub(controller, 'use')

        controller.middlewareLocals()
      })

      it('should call parent method', function () {
        expect(FormWizardController.prototype.middlewareLocals).to.have.been
          .calledOnce
      })

      it('should call set section summary method', function () {
        expect(controller.use).to.have.been.calledWithExactly(
          controller.setSectionSummary
        )
      })

      it('should call set move ID method', function () {
        expect(controller.use).to.have.been.calledWithExactly(
          controller.setMoveId
        )
      })

      it('should call set editable status', function () {
        expect(controller.use).to.have.been.calledWithExactly(
          controller.setMoveId
        )
      })

      it('should call set i18n context', function () {
        expect(controller.use).to.have.been.calledWithExactly(
          controller.seti18nContext
        )
      })

      it('should call set pagination', function () {
        expect(controller.use).to.have.been.calledWithExactly(
          controller.setPagination
        )
      })

      it('should call set move with summary', function () {
        expect(controller.use).to.have.been.calledWithExactly(setMoveSummary)
      })

      it('should call correct number of middleware', function () {
        expect(controller.use).to.be.callCount(6)
      })
    })

    describe('#seti18nContext', function () {
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = {}
        mockRes = {
          locals: {},
        }
      })

      context('without an assessment', function () {
        beforeEach(function () {
          controller.seti18nContext(mockReq, mockRes, nextSpy)
        })

        it('should not set move ID', function () {
          expect(mockRes.locals.i18nContext).to.equal('')
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with an assessment', function () {
        beforeEach(function () {
          mockReq.assessment = {
            framework: {
              name: 'person-escort-record',
            },
          }

          controller.seti18nContext(mockReq, mockRes, nextSpy)
        })

        it('should set move ID', function () {
          expect(mockRes.locals.i18nContext).to.equal('person_escort_record')
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#setPagination', function () {
      let mockReq, mockRes, nextSpy
      const mockSections = {
        'health-information': {
          key: 'health-information',
          name: 'Health information',
          order: 2,
        },
        'offence-information': {
          key: 'offence-information',
          name: 'Offence information',
          order: 4,
        },
        'property-information': {
          key: 'property-information',
          name: 'Property information',
          order: 3,
        },
        'risk-information': {
          key: 'risk-information',
          name: 'Risk information',
          order: 1,
        },
      }

      beforeEach(function () {
        sinon.stub(i18n, 't').returnsArg(0)
        nextSpy = sinon.spy()
        mockReq = {
          assessment: {
            _framework: {
              sections: mockSections,
            },
          },
          baseUrl: '/move/person-escort-record',
          frameworkSection: {},
        }
        mockRes = {
          locals: {},
        }
      })

      context('when current section is first section', function () {
        beforeEach(function () {
          mockReq.frameworkSection.key = 'risk-information'
          mockReq.baseUrl = `/move/person-escort-record/${mockReq.frameworkSection.key}`

          controller.setPagination(mockReq, mockRes, nextSpy)
        })

        it('should set pagination with only next', function () {
          expect(mockRes.locals.sectionPagination).to.deep.equal({
            classes: 'app-pagination--split govuk-!-margin-top-6',
            next: {
              href: '/move/person-escort-record/health-information',
              label: 'Health information',
              text: 'pagination.next_section',
            },
          })
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when current section is middle section', function () {
        beforeEach(function () {
          mockReq.frameworkSection.key = 'property-information'
          mockReq.baseUrl = `/move/person-escort-record/${mockReq.frameworkSection.key}`

          controller.setPagination(mockReq, mockRes, nextSpy)
        })

        it('should set pagination with both next and previous', function () {
          expect(mockRes.locals.sectionPagination).to.deep.equal({
            classes: 'app-pagination--split govuk-!-margin-top-6',
            next: {
              href: '/move/person-escort-record/offence-information',
              label: 'Offence information',
              text: 'pagination.next_section',
            },
            previous: {
              href: '/move/person-escort-record/health-information',
              label: 'Health information',
              text: 'pagination.previous_section',
            },
          })
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when current section is last section', function () {
        beforeEach(function () {
          mockReq.frameworkSection.key = 'offence-information'
          mockReq.baseUrl = `/move/person-escort-record/${mockReq.frameworkSection.key}`

          controller.setPagination(mockReq, mockRes, nextSpy)
        })

        it('should set pagination with only previous', function () {
          expect(mockRes.locals.sectionPagination).to.deep.equal({
            classes: 'app-pagination--split govuk-!-margin-top-6',
            previous: {
              href: '/move/person-escort-record/property-information',
              label: 'Property information',
              text: 'pagination.previous_section',
            },
          })
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#setMoveId', function () {
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = {}
        mockRes = {
          locals: {},
        }
      })

      context('without a move', function () {
        beforeEach(function () {
          controller.setMoveId(mockReq, mockRes, nextSpy)
        })

        it('should not set move ID', function () {
          expect(mockRes.locals.moveId).to.be.undefined
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('with a move', function () {
        beforeEach(function () {
          mockReq.move = {
            id: '12345',
          }

          controller.setMoveId(mockReq, mockRes, nextSpy)
        })

        it('should set move ID', function () {
          expect(mockRes.locals.moveId).to.equal('12345')
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#setEditableStatus', function () {
      let mockReq, mockRes, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = {
          assessment: {
            id: '12345',
            editable: true,
            framework: {
              name: 'person-escort-record',
            },
          },
          canAccess: sinon.stub().returns(true),
        }
        mockRes = {
          locals: {},
        }
      })

      context('when Person Escort Record is not editable', function () {
        beforeEach(function () {
          mockReq.assessment.editable = false

          controller.setEditableStatus(mockReq, mockRes, nextSpy)
        })

        it('should set isEditable to false', function () {
          expect(mockRes.locals.isEditable).to.equal(false)
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when Person Escort Record is editable', function () {
        beforeEach(function () {
          controller.setEditableStatus(mockReq, mockRes, nextSpy)
        })

        it('should set isEditable to true', function () {
          expect(mockRes.locals.isEditable).to.equal(true)
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context("when user doesn't have permission", function () {
        beforeEach(function () {
          mockReq.canAccess.returns(false)
          controller.setEditableStatus(mockReq, mockRes, nextSpy)
        })

        it('should check permissions correctly', function () {
          expect(mockReq.canAccess).to.be.calledOnceWithExactly(
            'person_escort_record:update'
          )
        })

        it('should set isEditable to false', function () {
          expect(mockRes.locals.isEditable).to.equal(false)
        })

        it('should call next without error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#setSectionSummary', function () {
      let mockReq, mockRes, nextSpy, mapStub

      beforeEach(function () {
        nextSpy = sinon.spy()
        mockReq = {
          baseUrl: '/base-url',
          form: {
            options: {
              allFields: {
                fieldOne: { name: 'field-one' },
                fieldTwo: { name: 'field-two' },
              },
            },
          },
          frameworkSection: {
            name: 'Foo',
            steps: {
              '/step-1': {},
              '/step-2': {},
              '/step-3': {},
            },
          },
          assessment: {
            responses: [{ id: '1' }, { id: '2' }, { id: '3' }],
          },
        }
        mockRes = {
          locals: {},
        }
        mapStub = sinon
          .stub()
          .onCall(0)
          .returns(['/step-1', { url: '/step-one' }])
          .onCall(1)
          .returns(undefined)
          .onCall(2)
          .returns(['/step-3', { url: '/step-three' }])
        sinon.stub(presenters, 'frameworkStepToSummary').returns(mapStub)

        controller.setSectionSummary(mockReq, mockRes, nextSpy)
      })

      it('should set section title', function () {
        expect(mockRes.locals.sectionTitle).to.equal('Foo')
      })

      it('should call presenter', function () {
        expect(presenters.frameworkStepToSummary).to.be.calledOnceWithExactly(
          mockReq.form.options.allFields,
          mockReq.assessment.responses,
          `${mockReq.baseUrl}/`
        )
      })

      it('should map each item', function () {
        expect(mapStub.callCount).to.equal(3)
      })

      it('should set summary steps filtering any falsy values', function () {
        expect(mockRes.locals.summarySteps).to.deep.equal([
          [
            '/step-1',
            {
              url: '/step-one',
            },
          ],
          [
            '/step-3',
            {
              url: '/step-three',
            },
          ],
        ])
      })

      it('should call next without error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
