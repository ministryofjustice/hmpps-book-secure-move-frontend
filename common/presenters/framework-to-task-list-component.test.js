const i18n = require('../../config/i18n')

const presenter = require('./framework-to-task-list-component')

describe('Presenters', function () {
  describe('#frameworkToTaskListComponent', function () {
    let output

    beforeEach(function () {
      sinon.stub(i18n, 't').returnsArg(0)
    })

    context('without arguments', function () {
      beforeEach(function () {
        output = presenter()
      })

      it('should return empty items array', function () {
        expect(output).to.deep.equal({
          items: [],
        })
      })
    })

    context('with sections that exists', function () {
      const mockProgress = [
        {
          key: 'sectionKey',
          status: 'in_progress',
        },
      ]
      const mockSections = {
        sectionKey: {
          name: 'Incomplete section',
        },
      }

      beforeEach(function () {
        output = presenter({
          sectionProgress: mockProgress,
          frameworkSections: mockSections,
        })
      })

      it('should return correct number of keys', function () {
        expect(Object.keys(output)).to.have.length(1)
      })

      it('should return section', function () {
        expect(output.items).to.have.length(1)
      })
    })

    context('with sections that does not exist', function () {
      const mockProgress = [
        {
          key: 'sectionKey',
          status: 'in_progress',
        },
      ]
      const mockSections = {}

      beforeEach(function () {
        output = presenter({
          sectionProgress: mockProgress,
          frameworkSections: mockSections,
        })
      })

      it('should return correct number of keys', function () {
        expect(Object.keys(output)).to.have.length(1)
      })

      it('should not return section', function () {
        expect(output.items).to.have.length(0)
      })
    })

    context('with different statuses', function () {
      const mockProgress = [
        {
          key: 'incompleteSection',
          status: 'in_progress',
        },
        {
          key: 'completeSection',
          status: 'completed',
        },
        {
          key: 'notStartedSection',
          status: 'not_started',
        },
      ]
      const mockSections = {
        incompleteSection: {
          name: 'Incomplete section',
          key: 'incomplete-section',
        },
        completeSection: {
          name: 'Complete section',
          key: 'complete-section',
        },
        notStartedSection: {
          name: 'Not started section',
          key: 'not-started-section',
        },
      }

      beforeEach(function () {
        output = presenter({
          sectionProgress: mockProgress,
          frameworkSections: mockSections,
        })
      })

      it('should return correct number of items', function () {
        expect(output.items).to.have.length(3)
      })

      describe('items', function () {
        describe('incomplete section', function () {
          it('should return correct number of keys', function () {
            expect(Object.keys(output.items[0])).to.have.length(3)
          })

          it('should return text', function () {
            expect(output.items[0].text).to.equal('Incomplete section')
          })

          it('should return href', function () {
            expect(output.items[0].href).to.equal('incomplete-section')
          })

          it('should translate status', function () {
            expect(i18n.t).to.be.calledWithExactly(
              'person-escort-record::statuses.in_progress'
            )
          })

          it('should return correct tag class', function () {
            expect(output.items[0].tag).to.deep.equal({
              text: 'person-escort-record::statuses.in_progress',
              classes: 'govuk-tag--blue',
            })
          })
        })

        describe('complete section', function () {
          it('should return correct number of keys', function () {
            expect(Object.keys(output.items[1])).to.have.length(3)
          })

          it('should return text', function () {
            expect(output.items[1].text).to.equal('Complete section')
          })

          it('should return href', function () {
            expect(output.items[1].href).to.equal('complete-section')
          })

          it('should translate status', function () {
            expect(i18n.t).to.be.calledWithExactly(
              'person-escort-record::statuses.completed'
            )
          })

          it('should return correct tag class', function () {
            expect(output.items[1].tag).to.deep.equal({
              text: 'person-escort-record::statuses.completed',
              classes: '',
            })
          })
        })

        describe('not started section', function () {
          it('should return correct number of keys', function () {
            expect(Object.keys(output.items[2])).to.have.length(3)
          })

          it('should return text', function () {
            expect(output.items[2].text).to.equal('Not started section')
          })

          it('should return href', function () {
            expect(output.items[2].href).to.equal('not-started-section')
          })

          it('should translate status', function () {
            expect(i18n.t).to.be.calledWithExactly(
              'person-escort-record::statuses.not_started'
            )
          })

          it('should return correct tag class', function () {
            expect(output.items[2].tag).to.deep.equal({
              text: 'person-escort-record::statuses.not_started',
              classes: 'govuk-tag--grey',
            })
          })
        })
      })
    })

    context('with base URL', function () {
      const mockProgress = [
        {
          key: 'sectionKey',
          status: 'in_progress',
        },
      ]
      const mockSections = {
        sectionKey: {
          name: 'Incomplete section',
          key: 'incomplete-section',
        },
      }

      beforeEach(function () {
        output = presenter({
          baseUrl: '/base-url/',
          sectionProgress: mockProgress,
          frameworkSections: mockSections,
        })
      })

      describe('items', function () {
        it('should return href with base url', function () {
          expect(output.items[0].href).to.equal('/base-url/incomplete-section')
        })
      })
    })
  })
})
