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

describe('Presenters', function() {
  describe('#moveToCardComponent()', function() {
    let transformedResponse
    let moveToCardComponent

    beforeEach(function() {
      sinon.stub(i18n, 't').returns('__translated__')
      moveToCardComponent = proxyquire('./move-to-card-component', {
        './person-to-card-component': personToCardComponentStub,
      })
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
              showImage: true,
              showMeta: true,
              showTags: true,
            })
          })

          it('should contain correct output', function() {
            expect(transformedResponse).to.deep.equal({
              ...mockPersonCardComponent,
              classes: '',
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
      context('when no person is associated to the move', function() {
        beforeEach(function() {
          transformedResponse = moveToCardComponent()({
            id: '12345',
            reference: 'AB12FG',
            status: 'proposed',
            person: null,
          })
        })
        it('does not create the link on the card', function() {
          expect(personToCardComponentItemStub).to.be.calledWithExactly({
            href: '',
          })
        })
      })
    })

    context('with href suffix', function() {
      beforeEach(function() {
        transformedResponse = moveToCardComponent({
          hrefSuffix: '/path/to/somewhere',
        })(mockMove)
      })

      it('should call person to card component correctly', function() {
        expect(personToCardComponentItemStub).to.be.calledWithExactly({
          ...mockMove.person,
          href: '/move/12345/path/to/somewhere',
        })
        expect(personToCardComponentStub).to.be.calledWithExactly({
          showImage: true,
          showMeta: true,
          showTags: true,
        })
      })
    })

    context('with image disabled', function() {
      beforeEach(function() {
        transformedResponse = moveToCardComponent({
          showImage: false,
        })(mockMove)
      })

      it('should call person to card component correctly', function() {
        expect(personToCardComponentItemStub).to.be.calledWithExactly({
          ...mockMove.person,
          href: '/move/12345',
        })
        expect(personToCardComponentStub).to.be.calledWithExactly({
          showImage: false,
          showMeta: true,
          showTags: true,
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
          showImage: true,
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
          showImage: true,
          showMeta: true,
          showTags: false,
        })
      })
    })

    context('with status disabled', function() {
      beforeEach(function() {
        transformedResponse = moveToCardComponent({
          showStatus: false,
        })(mockMove)
      })

      it('should call person to card component correctly', function() {
        expect(personToCardComponentItemStub).to.be.calledWithExactly({
          ...mockMove.person,
          href: '/move/12345',
        })
        expect(personToCardComponentStub).to.be.calledWithExactly({
          showImage: true,
          showMeta: true,
          showTags: true,
        })
      })

      it('should not set status on move card object', function() {
        expect(transformedResponse.status).to.be.undefined
      })
    })

    context('with compact design', function() {
      beforeEach(function() {
        transformedResponse = moveToCardComponent({
          isCompact: true,
        })(mockMove)
      })

      it('should call person to card component correctly', function() {
        expect(personToCardComponentItemStub).to.be.calledWithExactly({
          ...mockMove.person,
          href: '/move/12345',
        })
        expect(personToCardComponentStub).to.be.calledWithExactly({
          showImage: false,
          showMeta: false,
          showTags: false,
        })
      })

      it('should contain correct output', function() {
        expect(transformedResponse).to.deep.equal({
          ...mockPersonCardComponent,
          classes: 'app-card--compact ',
          status: undefined,
          caption: {
            text: '__translated__',
          },
        })
      })
    })

    context('with compact design and all others disabled', function() {
      beforeEach(function() {
        transformedResponse = moveToCardComponent({
          isCompact: true,
          showImage: true,
          showMeta: true,
          showTags: true,
        })(mockMove)
      })

      it('should call person to card component correctly', function() {
        expect(personToCardComponentItemStub).to.be.calledWithExactly({
          ...mockMove.person,
          href: '/move/12345',
        })
        expect(personToCardComponentStub).to.be.calledWithExactly({
          showImage: false,
          showMeta: false,
          showTags: false,
        })
      })

      it('should contain correct output', function() {
        expect(transformedResponse).to.deep.equal({
          ...mockPersonCardComponent,
          classes: 'app-card--compact ',
          status: undefined,
          caption: {
            text: '__translated__',
          },
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
            classes: '',
            status: undefined,
            caption: {
              text: '__translated__',
            },
          })
        })
      }
    })

    context('with card component classes', function() {
      const mockClasses = 'mock classes'

      beforeEach(function() {
        moveToCardComponent = proxyquire('./move-to-card-component', {
          './person-to-card-component': sinon.stub().callsFake(() =>
            sinon.stub().returns({
              ...mockPersonCardComponent,
              classes: mockClasses,
            })
          ),
        })
      })

      context('with compact design', function() {
        beforeEach(function() {
          transformedResponse = moveToCardComponent({ isCompact: true })(
            mockMove
          )
        })

        it('should combine with card classes', function() {
          expect(transformedResponse).to.deep.equal({
            ...mockPersonCardComponent,
            classes: `app-card--compact ${mockClasses}`,
            status: undefined,
            caption: {
              text: '__translated__',
            },
          })
        })
      })

      context('without compact design', function() {
        beforeEach(function() {
          transformedResponse = moveToCardComponent()(mockMove)
        })

        it('should return card classes', function() {
          expect(transformedResponse).to.deep.equal({
            ...mockPersonCardComponent,
            classes: mockClasses,
            status: {
              text: '__translated__',
            },
            caption: {
              text: '__translated__',
            },
          })
        })
      })
    })
  })
})
