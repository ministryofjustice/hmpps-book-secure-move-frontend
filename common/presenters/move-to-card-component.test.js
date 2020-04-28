const proxyquire = require('proxyquire')

const i18n = require('../../config/i18n')

const mockMove = {
  id: '12345',
  reference: 'AB12FS45',
  status: 'requested',
  person: {
    fullname: 'Name, Full',
  },
}
const mockPersonCardComponent = {
  href: '/move/12345',
  title: 'Name, Full',
}

const personToCardComponentItemStub = sinon
  .stub()
  .returns(mockPersonCardComponent)
const personToCardComponentStub = sinon
  .stub()
  .callsFake(() => personToCardComponentItemStub)

const moveToCardComponent = proxyquire('./move-to-card-component', {
  './person-to-card-component': personToCardComponentStub,
})

describe('Presenters', function() {
  describe('#moveToCardComponent()', function() {
    let transformedResponse

    beforeEach(function() {
      sinon.stub(i18n, 't').returns('__translated__')
    })

    context('with default options', function() {
      context('with mock move', function() {
        beforeEach(function() {
          transformedResponse = moveToCardComponent()(mockMove)
        })

        describe('response', function() {
          it('should call person to card component', function() {
            expect(personToCardComponentItemStub).to.be.calledWithExactly({
              ...mockMove.person,
              href: '/move/12345',
            })
            expect(personToCardComponentStub).to.be.calledWithExactly({
              showMeta: true,
              showTags: true,
            })
          })

          it('should contain correct output', function() {
            expect(transformedResponse).to.deep.equal({
              ...mockPersonCardComponent,
              status: {
                text: '__translated__',
              },
              caption: {
                text: '__translated__',
              },
            })
          })
        })

        describe('translations', function() {
          it('should translate status', function() {
            expect(i18n.t).to.be.calledWithExactly(
              `statuses::${mockMove.status}`
            )
          })

          it('should translate move reference', function() {
            expect(i18n.t).to.be.calledWithExactly('moves::move_reference', {
              reference: 'AB12FS45',
            })
          })

          it('should translate correct number of times', function() {
            expect(i18n.t).to.be.callCount(2)
          })
        })
      })
    })

    context('with meta disabled', function() {
      beforeEach(function() {
        transformedResponse = moveToCardComponent({
          showMeta: false,
        })(mockMove)
      })

      it('should call person to card component correctly', function() {
        expect(personToCardComponentItemStub).to.be.calledWithExactly({
          ...mockMove.person,
          href: '/move/12345',
        })
        expect(personToCardComponentStub).to.be.calledWithExactly({
          showMeta: false,
          showTags: true,
        })
      })
    })

    context('with tags disabled', function() {
      beforeEach(function() {
        transformedResponse = moveToCardComponent({
          showTags: false,
        })(mockMove)
      })

      it('should call person to card component correctly', function() {
        expect(personToCardComponentItemStub).to.be.calledWithExactly({
          ...mockMove.person,
          href: '/move/12345',
        })
        expect(personToCardComponentStub).to.be.calledWithExactly({
          showMeta: true,
          showTags: false,
        })
      })
    })

    context('with statuses that should not show badge', function() {
      const excludedStatuses = ['cancelled']

      for (const excludedStatus of excludedStatuses) {
        beforeEach(function() {
          transformedResponse = moveToCardComponent()({
            ...mockMove,
            status: excludedStatus,
          })
        })

        it('should not translate status', function() {
          expect(i18n.t).not.to.be.calledWithExactly(
            `statuses::${excludedStatus}`
          )
        })

        it('should contain correct output', function() {
          expect(transformedResponse).to.deep.equal({
            ...mockPersonCardComponent,
            status: undefined,
            caption: {
              text: '__translated__',
            },
          })
        })
      }
    })
  })
})
