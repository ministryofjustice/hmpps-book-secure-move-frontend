const i18n = require('../../config/i18n')

const journeysToMetaListComponent = require('./journeys-to-meta-list-component')

describe('Presenters', function () {
  let mockJourneys

  beforeEach(function () {
    mockJourneys = [
      {
        state: 'cancelled',
        timestamp: '2020-01-01T14:00:00Z',
        move_type: '',
        from_location: {
          id: 'FACEFEED',
          title: 'HMP Leeds',
        },
        to_location: {
          id: 'ABADCAFE',
          title: 'HMP Bedford',
        },
        vehicle: {
          id: '1234',
          title: 'JM18 AHI',
        },
      },
      {
        state: 'proposed',
        timestamp: '2020-01-02T14:00:00Z',
        move_type: '',
        from_location: {
          id: 'FACEFEED',
          title: 'HMP Leeds',
        },
        to_location: {
          id: 'ABADCAFE',
          title: 'HMP Bedford',
        },
        vehicle: {
          id: '1AG',
          title: 'XK21 HUA',
        },
      },
      {
        state: 'in_progress',
        timestamp: '2020-01-02T18:00:00Z',
        move_type: '',
        from_location: {
          id: 'FACEFEED',
          title: 'HMP Bedford',
        },
        to_location: {
          id: 'ABADCAFE',
          title: 'HMP Pentonville',
        },
      },
      {
        state: 'completed',
        timestamp: '2020-01-02T22:00:00Z',
        move_type: '',
        from_location: {
          id: 'ABADCAFE',
          title: 'HMP Pentonville',
        },
        to_location: {
          id: 'LLEEEEDS',
          title: 'HMP Leeds',
        },
        vehicle: {
          id: '555',
          title: 'UH22 KAN',
        },
      },
    ]
  })

  describe('#journeysToMetaListComponent()', function () {
    let transformedResponse

    beforeEach(function () {
      sinon.stub(i18n, 't').returnsArg(0)
    })

    context('when provided no journeys', function () {
      beforeEach(function () {
        transformedResponse = journeysToMetaListComponent()
      })

      it('should return empty rows', function () {
        expect(transformedResponse).to.deep.equal([])
      })
    })

    context('when provided with multiple journeys with locations', function () {
      beforeEach(function () {
        transformedResponse = journeysToMetaListComponent(mockJourneys)
      })

      describe('response', function () {
        it('should contain correct rows', function () {
          expect(transformedResponse).to.have.lengthOf(4)
        })

        it('should contain correct tags', function () {
          const statuses = transformedResponse.map(i => i.tag.text)
          const statusClasses = transformedResponse.map(i => i.tag.classes)
          expect(statuses).to.deep.equal([
            'cancelled',
            'proposed',
            'in_progress',
            'completed',
          ])
          expect(statusClasses).to.deep.equal([
            'govuk-!-font-size-14 govuk-tag--red',
            'govuk-!-font-size-14 ',
            'govuk-!-font-size-14 govuk-tag--yellow',
            'govuk-!-font-size-14 govuk-tag--green',
          ])
        })

        it('should contain correct meta', function () {
          expect(transformedResponse[0].metaList).to.deep.equal({
            classes: 'app-meta-list',
            items: [
              {
                classes: 'govuk-!-font-size-16',
                key: {
                  text: 'moves::map.labels.route.heading',
                },
                value: {
                  text: 'moves::map.labels.route.text',
                },
              },
              {
                classes: 'govuk-!-font-size-16',
                key: {
                  text: 'moves::map.labels.vehicle.heading',
                },
                value: {
                  html: 'moves::map.labels.vehicle.text',
                },
              },
            ],
          })
        })
      })
    })
  })
})
