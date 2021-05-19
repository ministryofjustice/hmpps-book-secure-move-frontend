const proxyquire = require('proxyquire')

const i18n = require('../../config/i18n')

const mockMove = {
  id: '12345',
  reference: 'AB12FS45',
  status: 'requested',
  profile: {
    person: {
      _fullname: 'Name, Full',
      prison_number: 'A1234BC',
      police_national_computer: 'A1BC2D/E3',
    },
  },
  to_location: {
    title: 'Pentonville',
  },
  from_location: {
    title: 'Snaresbrook Court',
  },
}
const mockPersonCardComponent = {
  href: '/move/12345',
  title: 'Name, Full',
}

const profileToCardComponentItemStub = sinon
  .stub()
  .returns(mockPersonCardComponent)
const profileToCardComponentStub = sinon
  .stub()
  .callsFake(() => profileToCardComponentItemStub)
const moveToImportantEventsTagListComponent = sinon
  .stub()
  .returns('moveToImportantEventsTagListComponent')

describe('Presenters', function () {
  describe('#moveToCardComponent()', function () {
    let transformedResponse
    let moveToCardComponent

    beforeEach(function () {
      sinon.stub(i18n, 't').returns('__translated__')
      moveToCardComponent = proxyquire('./move-to-card-component', {
        './profile-to-card-component': profileToCardComponentStub,
        './move-to-important-events-tag-list-component':
          moveToImportantEventsTagListComponent,
      })
    })

    context('with default options', function () {
      context('with mock move', function () {
        beforeEach(function () {
          transformedResponse = moveToCardComponent()(mockMove)
        })

        describe('response', function () {
          it('should call profile to card component', function () {
            expect(profileToCardComponentItemStub).to.be.calledWithExactly({
              ...mockMove.profile,
              href: '/move/12345',
            })
            expect(profileToCardComponentStub).to.be.calledWithExactly({
              locationType: undefined,
              meta: [],
              showImage: true,
              showMeta: true,
              showTags: true,
            })
          })

          it('should contain correct output', function () {
            expect(transformedResponse).to.deep.equal({
              ...mockPersonCardComponent,
              classes: '',
              status: {
                text: '__translated__',
              },
              caption: {
                text: '__translated__',
              },
              tags: [{ items: 'moveToImportantEventsTagListComponent' }],
            })
          })
        })

        describe('translations', function () {
          it('should translate status', function () {
            expect(i18n.t).to.be.calledWithExactly(
              `statuses::${mockMove.status}`
            )
          })

          it('should translate move reference', function () {
            expect(i18n.t).to.be.calledWithExactly('moves::move_reference', {
              reference: 'AB12FS45',
            })
          })

          it('should translate correct number of times', function () {
            expect(i18n.t).to.be.callCount(2)
          })
        })
      })
      context('when no person is associated to the move', function () {
        beforeEach(function () {
          transformedResponse = moveToCardComponent()({
            id: '12345',
            reference: 'AB12FG',
            status: 'proposed',
            person: null,
          })
        })
        it('does not create the link on the card', function () {
          expect(profileToCardComponentItemStub).to.be.calledWithExactly({
            href: '',
          })
        })
      })
    })

    context('with href suffix', function () {
      beforeEach(function () {
        transformedResponse = moveToCardComponent({
          hrefSuffix: '/path/to/somewhere',
        })(mockMove)
      })

      it('should call profile to card component correctly', function () {
        expect(profileToCardComponentItemStub).to.be.calledWithExactly({
          ...mockMove.profile,
          href: '/move/12345/path/to/somewhere',
        })
        expect(profileToCardComponentStub).to.be.calledWithExactly({
          locationType: undefined,
          meta: [],
          showImage: true,
          showMeta: true,
          showTags: true,
        })
      })
    })

    context('with image disabled', function () {
      beforeEach(function () {
        transformedResponse = moveToCardComponent({
          showImage: false,
        })(mockMove)
      })

      it('should call profile to card component correctly', function () {
        expect(profileToCardComponentItemStub).to.be.calledWithExactly({
          ...mockMove.profile,
          href: '/move/12345',
        })
        expect(profileToCardComponentStub).to.be.calledWithExactly({
          locationType: undefined,
          meta: [],
          showImage: false,
          showMeta: true,
          showTags: true,
        })
      })
    })

    context('with meta disabled', function () {
      beforeEach(function () {
        transformedResponse = moveToCardComponent({
          showMeta: false,
        })(mockMove)
      })

      it('should call profile to card component correctly', function () {
        expect(profileToCardComponentItemStub).to.be.calledWithExactly({
          ...mockMove.profile,
          href: '/move/12345',
        })
        expect(profileToCardComponentStub).to.be.calledWithExactly({
          locationType: undefined,
          meta: [],
          showImage: true,
          showMeta: false,
          showTags: true,
        })
      })
    })

    context('with tags disabled', function () {
      beforeEach(function () {
        transformedResponse = moveToCardComponent({
          showTags: false,
        })(mockMove)
      })

      it('should call profile to card component correctly', function () {
        expect(profileToCardComponentItemStub).to.be.calledWithExactly({
          ...mockMove.profile,
          href: '/move/12345',
        })
        expect(profileToCardComponentStub).to.be.calledWithExactly({
          locationType: undefined,
          meta: [],
          showImage: true,
          showMeta: true,
          showTags: false,
        })
      })
    })

    context('with status disabled', function () {
      beforeEach(function () {
        transformedResponse = moveToCardComponent({
          showStatus: false,
        })(mockMove)
      })

      it('should call profile to card component correctly', function () {
        expect(profileToCardComponentItemStub).to.be.calledWithExactly({
          ...mockMove.profile,
          href: '/move/12345',
        })
        expect(profileToCardComponentStub).to.be.calledWithExactly({
          locationType: undefined,
          meta: [],
          showImage: true,
          showMeta: true,
          showTags: true,
        })
      })

      it('should not set status on move card object', function () {
        expect(transformedResponse.status).to.be.undefined
      })
    })

    context('with compact design', function () {
      beforeEach(function () {
        transformedResponse = moveToCardComponent({
          isCompact: true,
        })(mockMove)
      })

      it('should call profile to card component correctly', function () {
        expect(profileToCardComponentItemStub).to.be.calledWithExactly({
          ...mockMove.profile,
          href: '/move/12345',
        })
        expect(profileToCardComponentStub).to.be.calledWithExactly({
          locationType: undefined,
          meta: [],
          showImage: false,
          showMeta: false,
          showTags: false,
        })
      })

      it('should contain correct output', function () {
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

    context('with compact design and all others disabled', function () {
      beforeEach(function () {
        transformedResponse = moveToCardComponent({
          isCompact: true,
          showImage: true,
          showMeta: true,
          showTags: true,
        })(mockMove)
      })

      it('should call profile to card component correctly', function () {
        expect(profileToCardComponentItemStub).to.be.calledWithExactly({
          ...mockMove.profile,
          href: '/move/12345',
        })
        expect(profileToCardComponentStub).to.be.calledWithExactly({
          locationType: undefined,
          meta: [],
          showImage: false,
          showMeta: false,
          showTags: false,
        })
      })

      it('should contain correct output', function () {
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

    context('with statuses that should not show badge', function () {
      const excludedStatuses = ['cancelled']

      for (const excludedStatus of excludedStatuses) {
        beforeEach(function () {
          transformedResponse = moveToCardComponent()({
            ...mockMove,
            status: excludedStatus,
          })
        })

        it('should not translate status', function () {
          expect(i18n.t).not.to.be.calledWithExactly(
            `statuses::${excludedStatus}`
          )
        })

        it('should contain correct output', function () {
          expect(transformedResponse).to.deep.equal({
            ...mockPersonCardComponent,
            classes: '',
            status: undefined,
            caption: {
              text: '__translated__',
            },
            tags: [{ items: 'moveToImportantEventsTagListComponent' }],
          })
        })
      }
    })

    context('with card component classes', function () {
      const mockClasses = 'mock classes'

      beforeEach(function () {
        moveToCardComponent = proxyquire('./move-to-card-component', {
          './profile-to-card-component': sinon.stub().callsFake(() =>
            sinon.stub().returns({
              ...mockPersonCardComponent,
              classes: mockClasses,
            })
          ),
          './move-to-important-events-tag-list-component':
            moveToImportantEventsTagListComponent,
        })
      })

      context('with compact design', function () {
        beforeEach(function () {
          transformedResponse = moveToCardComponent({ isCompact: true })(
            mockMove
          )
        })

        it('should combine with card classes', function () {
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

      context('without compact design', function () {
        beforeEach(function () {
          transformedResponse = moveToCardComponent()(mockMove)
        })

        it('should return card classes', function () {
          expect(transformedResponse).to.deep.equal({
            ...mockPersonCardComponent,
            classes: mockClasses,
            status: {
              text: '__translated__',
            },
            caption: {
              text: '__translated__',
            },
            tags: [{ items: 'moveToImportantEventsTagListComponent' }],
          })
        })
      })
    })

    context('with locations', function () {
      context('with to location', function () {
        beforeEach(function () {
          transformedResponse = moveToCardComponent({
            showToLocation: true,
            showMeta: true,
          })(mockMove)
        })

        it('should call profile to card component correctly', function () {
          expect(profileToCardComponentItemStub).to.be.calledWithExactly({
            ...mockMove.profile,
            href: '/move/12345',
          })
          expect(profileToCardComponentStub).to.be.calledWithExactly({
            locationType: undefined,
            meta: [
              {
                label: { text: '__translated__' },
                text: mockMove.to_location.title,
              },
            ],
            showImage: true,
            showMeta: true,
            showTags: true,
          })
        })
      })

      context('with from location', function () {
        beforeEach(function () {
          transformedResponse = moveToCardComponent({
            showFromLocation: true,
            showMeta: true,
          })(mockMove)
        })

        it('should call profile to card component correctly', function () {
          expect(profileToCardComponentItemStub).to.be.calledWithExactly({
            ...mockMove.profile,
            href: '/move/12345',
          })
          expect(profileToCardComponentStub).to.be.calledWithExactly({
            locationType: undefined,
            meta: [
              {
                label: { text: '__translated__' },
                text: mockMove.from_location.title,
              },
            ],
            showImage: true,
            showMeta: true,
            showTags: true,
          })
        })
      })

      context('with to location', function () {
        beforeEach(function () {
          transformedResponse = moveToCardComponent({
            showToLocation: true,
            showFromLocation: true,
            showMeta: true,
          })(mockMove)
        })

        it('should call profile to card component correctly', function () {
          expect(profileToCardComponentItemStub).to.be.calledWithExactly({
            ...mockMove.profile,
            href: '/move/12345',
          })
          expect(profileToCardComponentStub).to.be.calledWithExactly({
            locationType: undefined,
            meta: [
              {
                label: { text: '__translated__' },
                text: mockMove.from_location.title,
              },
              {
                label: { text: '__translated__' },
                text: mockMove.to_location.title,
              },
            ],
            showImage: true,
            showMeta: true,
            showTags: true,
          })
        })
      })

      context('when locationType is provided', function () {
        beforeEach(function () {
          mockMove.to_location.location_type = 'prison'
        })

        beforeEach(function () {
          transformedResponse = moveToCardComponent({
            showMeta: true,
            locationType: 'prison',
          })(mockMove)
        })

        it('should call profile to card component correctly', function () {
          expect(profileToCardComponentItemStub).to.be.calledWithExactly({
            ...mockMove.profile,
            href: '/move/12345',
          })
          expect(profileToCardComponentStub).to.be.calledWithExactly({
            locationType: 'prison',
            meta: [],
            showImage: true,
            showMeta: true,
            showTags: true,
          })
        })
      })
    })
  })
})
