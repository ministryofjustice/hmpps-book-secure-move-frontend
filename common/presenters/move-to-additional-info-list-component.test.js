const timezoneMock = require('timezone-mock')

const i18n = require('../../config/i18n').default
const filters = require('../../config/nunjucks/filters')

const moveToAdditionalInfoListComponent = require('./move-to-additional-info-list-component')

const mockMove = {
  time_due: '2000-01-01T14:00:00Z',
  additional_information: 'Some more info',
  move_type: 'hospital',
  recall_date: '2023-01-09',
}

const formattedDate = 'Monday 9 Jan 2023'

describe('Presenters', function () {
  describe('#moveToAdditionalInfoListComponent()', function () {
    let transformedResponse

    beforeEach(function () {
      timezoneMock.register('UTC')
      sinon.stub(filters, 'formatDateWithDay').returnsArg(0)
      sinon.stub(filters, 'formatTime').returnsArg(0)
      sinon.stub(i18n, 't').returnsArg(0)
    })

    afterEach(function () {
      timezoneMock.unregister()
    })

    context('when provided no move', function () {
      beforeEach(function () {
        transformedResponse = moveToAdditionalInfoListComponent()
      })

      it('should return undefined', function () {
        expect(transformedResponse).to.be.undefined
      })
    })

    context('when provided with a mock move object', function () {
      beforeEach(function () {
        transformedResponse = moveToAdditionalInfoListComponent(mockMove)
      })

      describe('response', function () {
        it('should contain correct rows', function () {
          expect(transformedResponse).to.have.property('rows')
          expect(transformedResponse.rows.length).to.equal(3)
        })

        it('should order items correctly', function () {
          const keys = transformedResponse.rows.map(row => row.key.text)
          expect(keys).to.deep.equal([
            'fields::time_due.label',
            'fields::additional_information.display.label',
            'recall_date',
          ])
        })

        it('should contain correct values', function () {
          const keys = transformedResponse.rows.map(row => row.value.text)

          expect(keys).to.deep.equal([
            mockMove.time_due,
            mockMove.additional_information,
            formattedDate,
          ])
        })

        it('should contain correct row structure', function () {
          transformedResponse.rows.forEach(row => {
            expect(row).to.include.keys(['key', 'value'])
          })
        })

        it('should contain key', function () {
          expect(transformedResponse).to.have.property('key')
          expect(transformedResponse.key).to.equal('hospital')
        })

        it('should contain count', function () {
          expect(transformedResponse).to.have.property('count')
          expect(transformedResponse.count).to.equal(3)
        })

        it('should contain heading', function () {
          expect(transformedResponse).to.have.property('heading')
          expect(transformedResponse.heading).to.equal(
            'moves::detail.additional_information.heading'
          )
        })
      })

      describe('translations', function () {
        it('should translate keys', function () {
          transformedResponse.rows.forEach(row => {
            expect(i18n.t).to.be.calledWithExactly(row.key.text, {
              context: 'hospital',
            })
          })
        })

        it('should translate heading', function () {
          expect(i18n.t).to.be.calledWithExactly(
            'moves::detail.additional_information.heading',
            {
              context: 'hospital',
            }
          )
        })
      })

      describe('time due', function () {
        it('should format time due', function () {
          expect(filters.formatTime).to.be.calledWithExactly(mockMove.time_due)
        })
      })
    })

    context('with missing additional information', function () {
      beforeEach(function () {
        transformedResponse = moveToAdditionalInfoListComponent({
          ...mockMove,
          additional_information: null,
        })
      })

      describe('response', function () {
        it('should use fallback as value', function () {
          const keys = transformedResponse.rows.map(
            row => row.value.text || row.value.html
          )
          expect(keys).to.deep.equal([
            mockMove.time_due,
            'not_provided',
            formattedDate,
          ])
        })
      })
    })

    context('with missing time due', function () {
      beforeEach(function () {
        transformedResponse = moveToAdditionalInfoListComponent({
          ...mockMove,
          time_due: null,
        })
      })

      describe('response', function () {
        it('should not include time', function () {
          const keys = transformedResponse.rows.map(
            row => row.value.text || row.value.html
          )
          expect(keys).to.deep.equal([
            mockMove.additional_information,
            formattedDate,
          ])
        })
      })
    })

    context('with missing recall date', function () {
      beforeEach(function () {
        transformedResponse = moveToAdditionalInfoListComponent({
          ...mockMove,
          recall_date: null,
        })
      })

      describe('response', function () {
        it('should not include recall date', function () {
          const keys = transformedResponse.rows.map(
            row => row.value.text || row.value.html
          )
          expect(keys).to.deep.equal([
            mockMove.time_due,
            mockMove.additional_information,
          ])
        })
      })
    })

    context('with update URLs', function () {
      const updateUrls = {
        move: 'http://www.example.com/move-details',
        recall_info: 'http://www.example.com/recall-info',
      }

      context('when prison recall move', function () {
        beforeEach(function () {
          transformedResponse = moveToAdditionalInfoListComponent(
            {
              ...mockMove,
              time_due: null,
              move_type: 'prison_recall',
            },
            updateUrls
          )
        })

        describe('response', function () {
          it('should include the update link for recall date', function () {
            const recallDateRow = transformedResponse.rows.find(
              row => row.updateJourneyKey === 'recall_info'
            )

            expect(recallDateRow.actions.items).to.eql([
              {
                attributes: {
                  'data-update-link': 'recall_info',
                },
                category: 'recall_info',
                href: 'http://www.example.com/recall-info',
                html: 'moves::update_link.link_text',
              },
            ])
          })

          it('should include the update link for additional info', function () {
            const additionalInfoRow = transformedResponse.rows.find(
              row => row.updateJourneyKey === 'move'
            )

            expect(additionalInfoRow.actions.items).to.eql([
              {
                attributes: {
                  'data-update-link': 'move',
                },
                category: 'move',
                href: 'http://www.example.com/move-details',
                html: 'moves::update_link.link_text',
              },
            ])
          })
        })
      })

      context('when not a prison recall move', function () {
        beforeEach(function () {
          transformedResponse = moveToAdditionalInfoListComponent(
            {
              ...mockMove,
              time_due: null,
            },
            updateUrls
          )
        })

        describe('response', function () {
          it('should not include the update link for additional info', function () {
            const additionalInfoRow = transformedResponse.rows.find(
              row => row.updateJourneyKey === 'move'
            )

            expect(additionalInfoRow).to.be.undefined
          })
        })
      })
    })

    describe('move types', function () {
      const validMoveTypes = ['hospital', 'prison_recall', 'video_remand']
      const invalidMoveTypes = ['court_appearance', 'prison_transfer']

      validMoveTypes.forEach(moveType => {
        it('should return correct keys', function () {
          transformedResponse = moveToAdditionalInfoListComponent({
            ...mockMove,
            move_type: moveType,
          })

          expect(Object.keys(transformedResponse)).to.deep.equal([
            'classes',
            'count',
            'key',
            'heading',
            'rows',
          ])
        })
      })

      invalidMoveTypes.forEach(moveType => {
        it('should return undefined', function () {
          transformedResponse = moveToAdditionalInfoListComponent({
            ...mockMove,
            move_type: moveType,
          })

          expect(transformedResponse).to.be.undefined
        })
      })
    })
  })
})
