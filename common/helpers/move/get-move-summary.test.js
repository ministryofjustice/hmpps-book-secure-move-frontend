const proxyquire = require('proxyquire')

const moveToMetaListComponent = sinon.stub().returns('__move-summary__')
const personToMetaListComponent = sinon.stub().returns('__person-summary__')

const getMoveSummary = proxyquire('./get-move-summary', {
  '../../presenters/move-to-meta-list-component': moveToMetaListComponent,
  '../../presenters/person-to-meta-list-component': personToMetaListComponent,
})

describe('Move helpers', function () {
  describe('#getMoveSummary', function () {
    let mockMove
    let locals

    beforeEach(function () {
      moveToMetaListComponent.resetHistory()
      personToMetaListComponent.resetHistory()

      mockMove = {
        id: 'moveId',
      }
    })

    context('with move', function () {
      context('with person on move', function () {
        beforeEach(function () {
          mockMove.person = {
            _image_url: '/person/image/2',
            _fullname: 'DOE, JANE',
            id: '__person_2__',
          }
          locals = getMoveSummary(mockMove, { foo: 'bar' })
        })

        it('should get the move summary', function () {
          expect(moveToMetaListComponent).to.be.calledOnceWithExactly(
            mockMove,
            { foo: 'bar' }
          )
        })

        it('should get the person summary', function () {
          expect(personToMetaListComponent).to.be.calledOnceWithExactly({
            _image_url: '/person/image/2',
            _fullname: 'DOE, JANE',
            id: '__person_2__',
          })
        })

        it('should return the move summary', function () {
          expect(locals).to.deep.equal({
            moveSummary: '__move-summary__',
            personSummary: {
              metaList: '__person-summary__',
              image: {
                url: '/person/image/2',
                alt: 'DOE, JANE',
              },
            },
          })
        })
      })

      context('with person on profile', function () {
        beforeEach(function () {
          mockMove.profile = {
            person: {
              _image_url: '/person/image/1',
              _fullname: 'DOE, JOHN',
              id: '__person_1__',
            },
          }
          locals = getMoveSummary(mockMove, { foo: 'bar' })
        })

        it('should get the move summary', function () {
          expect(moveToMetaListComponent).to.be.calledOnceWithExactly(
            mockMove,
            { foo: 'bar' }
          )
        })

        it('should get the person summary', function () {
          expect(personToMetaListComponent).to.be.calledOnceWithExactly({
            _image_url: '/person/image/1',
            _fullname: 'DOE, JOHN',
            id: '__person_1__',
          })
        })

        it('should return the move summary', function () {
          expect(locals).to.deep.equal({
            moveSummary: '__move-summary__',
            personSummary: {
              metaList: '__person-summary__',
              image: {
                url: '/person/image/1',
                alt: 'DOE, JOHN',
              },
            },
          })
        })
      })

      context('without person', function () {
        beforeEach(function () {
          locals = getMoveSummary(mockMove, { foo: 'bar' })
        })

        it('should get the move summary', function () {
          expect(moveToMetaListComponent).to.be.calledOnceWithExactly(
            mockMove,
            { foo: 'bar' }
          )
        })

        it('should get the person summary', function () {
          expect(personToMetaListComponent).to.be.calledOnceWithExactly(
            undefined
          )
        })

        it('should return the move summary', function () {
          expect(locals).to.deep.equal({
            moveSummary: '__move-summary__',
            personSummary: {
              metaList: '__person-summary__',
              image: undefined,
            },
          })
        })
      })
    })

    context('without move', function () {
      beforeEach(function () {
        locals = getMoveSummary()
      })

      it('should not get the move summary', function () {
        expect(moveToMetaListComponent).not.to.be.called
      })

      it('should return empty object', function () {
        expect(locals).to.deep.equal({})
      })
    })
  })
})
