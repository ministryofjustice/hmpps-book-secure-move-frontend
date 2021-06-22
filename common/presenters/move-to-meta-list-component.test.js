const proxyquire = require('proxyquire')
const timezoneMock = require('timezone-mock')

const componentService = require('../../common/services/component')
const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')
const getUpdateLinks = sinon.stub().returns({})

const moveToMetaListComponent = proxyquire('./move-to-meta-list-component', {
  '../helpers/move/get-update-links': getUpdateLinks,
})

const mockMove = {
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
    title: 'HMP Leeds',
  },
  to_location: {
    title: 'Barrow in Furness County Court',
  },
}

const canAccess = sinon.stub()
const updateSteps = ['a', 'b']

describe('Presenters', function () {
  describe('#moveToMetaListComponent()', function () {
    beforeEach(function () {
      timezoneMock.register('UTC')
      sinon.stub(componentService, 'getComponent').returnsArg(0)
      sinon.stub(filters, 'formatDateWithRelativeDay').returnsArg(0)
      sinon.stub(i18n, 't').returnsArg(0)
      getUpdateLinks.resetHistory()
    })

    afterEach(function () {
      timezoneMock.unregister()
    })

    context('when provided with a mock move object', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = moveToMetaListComponent(
          mockMove,
          canAccess,
          updateSteps
        )
      })

      describe('response', function () {
        it('should get the actions', function () {
          expect(getUpdateLinks).to.be.calledOnceWithExactly(
            {
              _hasLeftCustody: false,
              id: mockMove.id,
              move_type: mockMove.move_type,
            },
            canAccess,
            updateSteps
          )
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
            'reference',
            'person_noun',
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
            'ABC12345 mojBadge',
            'BLOGGS, JOE',
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
          expect(i18n.t).to.be.callCount(13)
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

    context('with person hidden', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = moveToMetaListComponent(
          mockMove,
          canAccess,
          updateSteps,
          false
        )
      })

      describe('response', function () {
        it('should contain correct number of items', function () {
          expect(transformedResponse).to.have.property('items')
          expect(transformedResponse.items.length).to.equal(5)
        })

        it('should not contain person key', function () {
          const keys = transformedResponse.items.map(
            item => item.key.text || item.key.html
          )
          expect(keys).deep.equal([
            'reference',
            'fields::from_location.short_label',
            'fields::move_type.short_label',
            'fields::date_type.label',
            'collections::vehicle_registration',
          ])
        })

        it('should not contain person value', function () {
          const values = transformedResponse.items.map(
            item => item.value.text || item.value.html
          )
          expect(values).deep.equal([
            'ABC12345 mojBadge',
            'HMP Leeds',
            'Barrow in Furness County Court',
            '2019-06-09',
            'GG01 AJY',
          ])
        })
      })
    })

    context('when provided without a move object', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = moveToMetaListComponent(
          undefined,
          canAccess,
          updateSteps
        )
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

    context('with only `date from`', function () {
      const mockMove = {
        date_from: '2020-05-01',
      }
      let transformedResponse

      beforeEach(function () {
        transformedResponse = moveToMetaListComponent(mockMove)
      })

      describe('response', function () {
        it('should contain correct key ordering', function () {
          const keys = transformedResponse.items.map(
            item => item.key.text || item.key.html
          )
          expect(keys).deep.equal(['fields::date_from.label'])
        })

        it('should contain date_from date', function () {
          const values = transformedResponse.items.map(
            item => item.value.text || item.value.html
          )
          expect(values).deep.equal(['2020-05-01'])
        })
      })
    })

    context('with both `date from` and `date to`', function () {
      const mockMove = {
        date_from: '2020-05-01',
        date_to: '2020-05-10',
      }
      let transformedResponse

      beforeEach(function () {
        transformedResponse = moveToMetaListComponent(mockMove)
      })

      describe('response', function () {
        it('should contain correct key ordering', function () {
          const keys = transformedResponse.items.map(
            item => item.key.text || item.key.html
          )
          expect(keys).deep.equal([
            'fields::date_from.label',
            'fields::date_to.label',
          ])
        })

        it('should contain both dates', function () {
          const values = transformedResponse.items.map(
            item => item.value.text || item.value.html
          )
          expect(values).deep.equal(['2020-05-01', '2020-05-10'])
        })
      })
    })

    context('with all dates', function () {
      const mockMove = {
        date_from: '2020-05-01',
        date_to: '2020-05-10',
        date: '2020-06-01',
      }
      let transformedResponse

      beforeEach(function () {
        transformedResponse = moveToMetaListComponent(mockMove)
      })

      describe('response', function () {
        it('should contain correct key ordering', function () {
          const keys = transformedResponse.items.map(
            item => item.key.text || item.key.html
          )
          expect(keys).deep.equal(['fields::date_type.label'])
        })

        it('should only contain move date', function () {
          const values = transformedResponse.items.map(
            item => item.value.text || item.value.html
          )
          expect(values).deep.equal(['2020-06-01'])
        })
      })
    })

    context('when provided with actions', function () {
      let transformedResponse
      const moveAction = {
        href: '/move',
        html: 'Update move',
      }
      const dateAction = {
        href: '/date',
        html: 'Update date',
      }

      beforeEach(function () {
        getUpdateLinks.returns({
          move: moveAction,
          date: dateAction,
        })

        transformedResponse = moveToMetaListComponent(
          mockMove,
          canAccess,
          updateSteps
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
            ...moveAction,
            classes: 'app-meta-list__action--sidebar',
          },
          {
            ...dateAction,
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
          transformedResponse = moveToMetaListComponent({
            ...mockMove,
            move_type: 'prison_recall',
            additional_information: mockAdditionalInformation,
          })
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
            'reference',
            'person_noun',
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
            'ABC12345 mojBadge',
            'BLOGGS, JOE',
            'HMP Leeds',
            'fields::move_type.items.prison_recall.label — Some additional information about this move',
            '2019-06-09',
            'GG01 AJY',
          ])
        })
      })

      context('with video remand move type', function () {
        beforeEach(function () {
          transformedResponse = moveToMetaListComponent({
            ...mockMove,
            move_type: 'video_remand',
            additional_information: mockAdditionalInformation,
          })
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
            'reference',
            'person_noun',
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
            'ABC12345 mojBadge',
            'BLOGGS, JOE',
            'HMP Leeds',
            'fields::move_type.items.video_remand.label — Some additional information about this move',
            '2019-06-09',
            'GG01 AJY',
          ])
        })
      })

      context('with prison transfer move type', function () {
        const mockPrisonTransferReason = 'Parole'

        beforeEach(function () {
          transformedResponse = moveToMetaListComponent({
            ...mockMove,
            move_type: 'prison_transfer',
            additional_information: mockAdditionalInformation,
            prison_transfer_reason: {
              title: mockPrisonTransferReason,
            },
          })
        })

        it('should contain correct number of items', function () {
          expect(transformedResponse).to.have.property('items')
          expect(transformedResponse.items.length).to.equal(7)
        })

        it('should contain correct key ordering', function () {
          const keys = transformedResponse.items.map(
            item => item.key.text || item.key.html
          )
          expect(keys).deep.equal([
            'reference',
            'person_noun',
            'fields::from_location.short_label',
            'fields::move_type.short_label',
            'fields::date_type.label',
            'fields::prison_transfer_type.label',
            'collections::vehicle_registration',
          ])
        })

        it('should contain correct values', function () {
          const values = transformedResponse.items.map(
            item => item.value.text || item.value.html
          )
          expect(values).deep.equal([
            'ABC12345 mojBadge',
            'BLOGGS, JOE',
            'HMP Leeds',
            'Barrow in Furness County Court',
            '2019-06-09',
            'Parole — Some additional information about this move',
            'GG01 AJY',
          ])
        })
      })

      context('with other move type', function () {
        beforeEach(function () {
          transformedResponse = moveToMetaListComponent({
            ...mockMove,
            additional_information: mockAdditionalInformation,
          })
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
            'reference',
            'person_noun',
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
            'ABC12345 mojBadge',
            'BLOGGS, JOE',
            'HMP Leeds',
            'Barrow in Furness County Court',
            '2019-06-09',
            'GG01 AJY',
          ])
        })
      })
    })

    context('with agreement status', function () {
      let transformedResponse

      context('with `true` value', function () {
        context('without name', function () {
          beforeEach(function () {
            transformedResponse = moveToMetaListComponent({
              ...mockMove,
              move_agreed: true,
            })
          })

          it('should contain agreement status key', function () {
            const keys = transformedResponse.items.map(
              item => item.key.text || item.key.html
            )
            expect(keys[5]).to.equal('fields::move_agreed.label')
          })

          it('should contain agreement status value', function () {
            const values = transformedResponse.items.map(
              item => item.value.text || item.value.html
            )
            expect(values[5]).deep.equal(
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
            transformedResponse = moveToMetaListComponent({
              ...mockMove,
              move_agreed: true,
              move_agreed_by: 'Jon Doe',
            })
          })

          it('should contain agreement status key', function () {
            const keys = transformedResponse.items.map(
              item => item.key.text || item.key.html
            )
            expect(keys[5]).to.equal('fields::move_agreed.label')
          })

          it('should contain agreement status value', function () {
            const values = transformedResponse.items.map(
              item => item.value.text || item.value.html
            )
            expect(values[5]).deep.equal(
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
          transformedResponse = moveToMetaListComponent({
            ...mockMove,
            move_agreed: false,
            move_agreed_by: 'Jon Doe',
          })
        })

        it('should contain agreement status key', function () {
          const keys = transformedResponse.items.map(
            item => item.key.text || item.key.html
          )
          expect(keys[5]).to.equal('fields::move_agreed.label')
        })

        it('should contain agreement status value', function () {
          const values = transformedResponse.items.map(
            item => item.value.text || item.value.html
          )
          expect(values[5]).deep.equal(
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
          transformedResponse = moveToMetaListComponent({
            ...mockMove,
            move_agreed: 'true',
            move_agreed_by: 'Jon Doe',
          })
        })

        it('should contain agreement status key', function () {
          const keys = transformedResponse.items.map(
            item => item.key.text || item.key.html
          )
          expect(keys[5]).to.equal('fields::move_agreed.label')
        })

        it('should contain agreement status value', function () {
          const values = transformedResponse.items.map(
            item => item.value.text || item.value.html
          )
          expect(values[5]).deep.equal('moves::detail.agreement_status.agreed')
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
