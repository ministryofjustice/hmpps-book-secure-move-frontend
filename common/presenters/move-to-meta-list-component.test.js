const proxyquire = require('proxyquire')
const timezoneMock = require('timezone-mock')

const componentService = require('../../common/services/component')
const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')
const mapUpdateLinkStub = sinon.stub().returnsArg(0)

const moveToMetaListComponent = proxyquire('./move-to-meta-list-component', {
  '../helpers/move/map-update-link': mapUpdateLinkStub,
})

describe('Presenters', function () {
  describe('#moveToMetaListComponent()', function () {
    let mockMove
    let mockJourneys

    beforeEach(function () {
      timezoneMock.register('UTC')
      sinon.stub(componentService, 'getComponent').returnsArg(0)
      sinon.stub(filters, 'formatDateWithRelativeDay').returnsArg(0)
      sinon.stub(i18n, 't').returnsArg(0)
      mapUpdateLinkStub.resetHistory()

      mockMove = {
        _hasLeftCustody: false,
        _vehicleRegistration: 'GG01 AJY',
        reference: 'ABC12345',
        status: 'booked',
        date: '2019-06-09',
        time_due: '2000-01-01T14:00:00Z',
        move_type: 'court_appearance',
        profile: {
          person: {
            _fullname: 'BLOGGS, JOE',
          },
        },
        from_location: {
          id: '12345',
          title: 'HMP Leeds',
        },
        to_location: {
          id: '67890',
          title: 'Barrow in Furness County Court',
        },
      }

      mockJourneys = [
        {
          date: '2019-06-09',
          from_location: {
            title: 'HMP Leeds',
          },
          to_location: {
            title: 'Barrow in Furness County Court',
          },
        },
      ]
    })

    afterEach(function () {
      timezoneMock.unregister()
    })

    context('when provided with a mock move object', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = moveToMetaListComponent(mockMove, mockJourneys)
      })

      describe('response', function () {
        it('should contain classes', function () {
          expect(transformedResponse).to.have.property('classes')
          expect(transformedResponse.classes).to.equal('govuk-!-font-size-16')
        })

        it('should contain correct number of items', function () {
          expect(transformedResponse).to.have.property('items')
          expect(transformedResponse.items.length).to.equal(6)
        })

        it('should contain correct key ordering', function () {
          const keys = transformedResponse.items.map(
            item => item.key.text || item.key.html
          )
          expect(keys).deep.equal([
            'status',
            'reference',
            'fields::from_location.short_label',
            'fields::move_type.short_label',
            'fields::date_type.label',
            'collections::vehicle_registration',
          ])
        })

        it('should contain correct values', function () {
          const values = transformedResponse.items.map(
            item => item.value.text || item.value.html
          )
          expect(values).deep.equal([
            'mojBadge',
            'ABC12345',
            'HMP Leeds',
            'Barrow in Furness County Court',
            '2019-06-09',
            'GG01 AJY',
          ])
        })

        it('should contain correct actions', function () {
          const actions = transformedResponse.items.map(item => item.action)
          expect(actions).deep.equal([
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
          ])
        })

        it('should call date filter correct number of times', function () {
          expect(filters.formatDateWithRelativeDay).to.have.callCount(1)
        })

        it('should translate correct number of times', function () {
          expect(i18n.t).to.be.callCount(11)
        })
      })

      it('should use status for badge component', function () {
        expect(componentService.getComponent).to.be.calledOnceWithExactly(
          'mojBadge',
          {
            text: 'statuses::booked',
          }
        )
      })
    })

    context('when provided without a move object', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = moveToMetaListComponent()
      })

      describe('response', function () {
        it('should contain correct number of items', function () {
          expect(transformedResponse).to.have.property('items')
          expect(transformedResponse.items.length).to.equal(0)
        })

        it('should contain no keys', function () {
          const keys = transformedResponse.items.map(
            item => item.key.text || item.key.html
          )
          expect(keys).deep.equal([])
        })

        it('should contain no values', function () {
          const values = transformedResponse.items.map(
            item => item.value.text || item.value.html
          )
          expect(values).deep.equal([])
        })

        it('should contain no actions', function () {
          const actions = transformedResponse.items.map(item => item.action)
          expect(actions).deep.equal([])
        })
      })
    })

    context('when provided with updateUrls', function () {
      let transformedResponse
      let mockUpdateUrls

      beforeEach(function () {
        mockUpdateUrls = {
          move: {
            href: '/move',
            html: 'Update move',
          },
          date: {
            href: '/date',
            html: 'Update date',
          },
        }

        transformedResponse = moveToMetaListComponent(mockMove, mockJourneys, {
          updateUrls: mockUpdateUrls,
        })
      })

      it('should map update links', function () {
        expect(mapUpdateLinkStub.callCount).to.equal(
          Object.keys(mockUpdateUrls).length
        )

        expect(mapUpdateLinkStub).to.have.been.calledWithExactly(
          mockUpdateUrls.move,
          'move'
        )
        expect(mapUpdateLinkStub).to.have.been.calledWithExactly(
          mockUpdateUrls.date,
          'date'
        )
      })

      it('should contain correct number of items', function () {
        expect(transformedResponse).to.have.property('items')
        expect(transformedResponse.items.length).to.equal(6)
      })

      it('should contain correct actions', function () {
        const actions = transformedResponse.items.map(item => item.action)
        expect(actions).deep.equal([
          undefined,
          undefined,
          undefined,
          {
            ...mockUpdateUrls.move,
            classes: 'app-meta-list__action--sidebar',
          },
          {
            ...mockUpdateUrls.date,
            classes: 'app-meta-list__action--sidebar',
          },
          undefined,
        ])
      })
    })

    context('with additional information', function () {
      const mockAdditionalInformation =
        'Some additional information about this move'
      let transformedResponse

      context('with prison recall move type', function () {
        beforeEach(function () {
          transformedResponse = moveToMetaListComponent(
            {
              ...mockMove,
              move_type: 'prison_recall',
              additional_information: mockAdditionalInformation,
            },
            mockJourneys
          )
        })

        it('should contain correct key', function () {
          const keys = transformedResponse.items.map(
            item => item.key.text || item.key.html
          )
          expect(keys).to.include('fields::move_type.short_label')
        })

        it('should contain correct value', function () {
          const values = transformedResponse.items.map(
            item => item.value.text || item.value.html
          )
          expect(values).to.include(
            'fields::move_type.items.prison_recall.label — Some additional information about this move'
          )
        })

        it('should call translation correctly', function () {
          expect(i18n.t).to.be.calledWithExactly(
            'fields::move_type.items.prison_recall.label',
            {
              context: 'with_location',
              location: 'Barrow in Furness County Court',
            }
          )
        })
      })

      context('with video remand move type', function () {
        beforeEach(function () {
          transformedResponse = moveToMetaListComponent(
            {
              ...mockMove,
              move_type: 'video_remand',
              additional_information: mockAdditionalInformation,
            },
            mockJourneys
          )
        })

        it('should contain correct key', function () {
          const keys = transformedResponse.items.map(
            item => item.key.text || item.key.html
          )
          expect(keys).to.include('fields::move_type.short_label')
        })

        it('should contain correct value', function () {
          const values = transformedResponse.items.map(
            item => item.value.text || item.value.html
          )
          expect(values).to.not.include(
            'fields::move_type.items.video_remand.label — Some additional information about this move'
          )
          expect(values).to.include(
            'fields::move_type.items.video_remand.label'
          )
        })
      })

      context('with prison transfer move type', function () {
        const mockPrisonTransferReason = 'Parole'

        beforeEach(function () {
          transformedResponse = moveToMetaListComponent(
            {
              ...mockMove,
              move_type: 'prison_transfer',
              additional_information: mockAdditionalInformation,
              prison_transfer_reason: {
                title: mockPrisonTransferReason,
              },
            },
            mockJourneys
          )
        })

        it('should contain correct key', function () {
          const keys = transformedResponse.items.map(
            item => item.key.text || item.key.html
          )
          expect(keys).to.include('fields::move_type.short_label')
          expect(keys).to.include('fields::prison_transfer_type.label')
        })

        it('should contain correct value', function () {
          const values = transformedResponse.items.map(
            item => item.value.text || item.value.html
          )
          expect(values).to.include('Barrow in Furness County Court')
          expect(values).to.include(
            'Parole — Some additional information about this move'
          )
        })
      })

      context('with other move type', function () {
        beforeEach(function () {
          transformedResponse = moveToMetaListComponent(
            {
              ...mockMove,
              additional_information: mockAdditionalInformation,
            },
            mockJourneys
          )
        })

        it('should contain correct key', function () {
          const keys = transformedResponse.items.map(
            item => item.key.text || item.key.html
          )
          expect(keys).to.include('fields::move_type.short_label')
        })

        it('should contain correct value', function () {
          const values = transformedResponse.items.map(
            item => item.value.text || item.value.html
          )
          expect(values).to.include('Barrow in Furness County Court')
        })
      })
    })

    context('with agreement status', function () {
      let transformedResponse
      const keyIndex = 5

      context('with `true` value', function () {
        context('without name', function () {
          beforeEach(function () {
            transformedResponse = moveToMetaListComponent(
              {
                ...mockMove,
                ...mockJourneys,
                move_agreed: true,
              },
              mockJourneys
            )
          })

          it('should contain agreement status key', function () {
            const keys = transformedResponse.items.map(
              item => item.key.text || item.key.html
            )
            expect(keys[keyIndex]).to.equal('fields::move_agreed.label')
          })

          it('should contain agreement status value', function () {
            const values = transformedResponse.items.map(
              item => item.value.text || item.value.html
            )
            expect(values[keyIndex]).deep.equal(
              'moves::detail.agreement_status.agreed'
            )
          })

          it('should translate agreed label correctly', function () {
            expect(i18n.t).to.be.calledWithExactly(
              'moves::detail.agreement_status.agreed',
              {
                context: '',
                name: undefined,
              }
            )
          })
        })

        context('with name', function () {
          beforeEach(function () {
            transformedResponse = moveToMetaListComponent(
              {
                ...mockMove,
                move_agreed: true,
                move_agreed_by: 'Jon Doe',
              },
              mockJourneys
            )
          })

          it('should contain agreement status key', function () {
            const keys = transformedResponse.items.map(
              item => item.key.text || item.key.html
            )
            expect(keys[keyIndex]).to.equal('fields::move_agreed.label')
          })

          it('should contain agreement status value', function () {
            const values = transformedResponse.items.map(
              item => item.value.text || item.value.html
            )
            expect(values[keyIndex]).deep.equal(
              'moves::detail.agreement_status.agreed'
            )
          })

          it('should translate agreed label correctly', function () {
            expect(i18n.t).to.be.calledWithExactly(
              'moves::detail.agreement_status.agreed',
              {
                context: 'with_name',
                name: 'Jon Doe',
              }
            )
          })
        })
      })

      context('with `false` value', function () {
        beforeEach(function () {
          transformedResponse = moveToMetaListComponent(
            {
              ...mockMove,
              ...mockJourneys,
              move_agreed: false,
              move_agreed_by: 'Jon Doe',
            },
            mockJourneys
          )
        })

        it('should contain agreement status key', function () {
          const keys = transformedResponse.items.map(
            item => item.key.text || item.key.html
          )
          expect(keys[keyIndex]).to.equal('fields::move_agreed.label')
        })

        it('should contain agreement status value', function () {
          const values = transformedResponse.items.map(
            item => item.value.text || item.value.html
          )
          expect(values[keyIndex]).deep.equal(
            'moves::detail.agreement_status.not_agreed'
          )
        })

        it('should translate agreed label correctly', function () {
          expect(i18n.t).to.be.calledWithExactly(
            'moves::detail.agreement_status.agreed',
            {
              context: 'with_name',
              name: 'Jon Doe',
            }
          )
        })
      })

      context('with status that matches `yes` from field', function () {
        beforeEach(function () {
          transformedResponse = moveToMetaListComponent(
            {
              ...mockMove,
              ...mockJourneys,
              move_agreed: 'true',
              move_agreed_by: 'Jon Doe',
            },
            mockJourneys
          )
        })

        it('should contain agreement status key', function () {
          const keys = transformedResponse.items.map(
            item => item.key.text || item.key.html
          )
          expect(keys[keyIndex]).to.equal('fields::move_agreed.label')
        })

        it('should contain agreement status value', function () {
          const values = transformedResponse.items.map(
            item => item.value.text || item.value.html
          )
          expect(values[keyIndex]).deep.equal(
            'moves::detail.agreement_status.agreed'
          )
        })

        it('should translate agreed label correctly', function () {
          expect(i18n.t).to.be.calledWithExactly(
            'moves::detail.agreement_status.agreed',
            {
              context: 'with_name',
              name: 'Jon Doe',
            }
          )
        })
      })
    })
  })
})
