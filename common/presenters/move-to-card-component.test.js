const moveToCardComponent = require('./move-to-card-component')
const filters = require('../../config/nunjucks/filters')

const { data: mockMove } = require('../../test/fixtures/api-client/move.get.deserialized.json')

describe('Presenters', function () {
  describe('#moveToCardComponent()', function () {
    beforeEach(function () {
      sinon.stub(filters, 'formatDate').returns('18 Jun 1960')
      sinon.stub(filters, 'calculateAge').returns(50)
    })

    context('when provided with a mock move object', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = moveToCardComponent(mockMove)
      })

      describe('response', function () {
        it('should contain a href', function () {
          expect(transformedResponse).to.have.property('href')
          expect(transformedResponse.href).to.equal(`/moves/${mockMove.id}`)
        })

        it('should contain a title', function () {
          const person = mockMove.person
          expect(transformedResponse).to.have.property('title')
          expect(transformedResponse.title).to.deep.equal({
            text: `${person.last_name.toUpperCase()}, ${person.first_names.toUpperCase()}`,
          })
        })

        it('should contain a caption', function () {
          expect(transformedResponse).to.have.property('caption')
          expect(transformedResponse.caption).to.deep.equal({
            text: mockMove.reference,
          })
        })

        it('should contain correct meta data', function () {
          expect(transformedResponse).to.have.property('meta')
          expect(transformedResponse.meta).to.deep.equal({
            items: [{
              hideLabel: true,
              label: 'Date of birth',
              html: '18 Jun 1960 (Age 50)',
            }, {
              hideLabel: true,
              label: 'Gender',
              text: mockMove.person.gender.title,
            }, {
              hideLabel: true,
              label: 'Ethnicity',
              text: mockMove.person.ethnicity.title,
            }],
          })
        })
      })

      context('when meta contains all falsey values', function () {
        let transformedResponse

        beforeEach(function () {
          transformedResponse = moveToCardComponent({
            person: {
              last_name: 'Jones',
              first_names: 'Steve',
              date_of_birth: '',
              gender: false,
              ethnicity: undefined,
            },
          })
        })

        it('should correctly remove false items', function () {
          expect(transformedResponse).to.have.property('meta')
          expect(transformedResponse.meta.items.length).to.equal(0)
        })
      })

      context('when meta contains some falsey values', function () {
        let transformedResponse

        beforeEach(function () {
          transformedResponse = moveToCardComponent({
            person: {
              last_name: 'Jones',
              first_names: 'Steve',
              date_of_birth: '',
              gender: mockMove.person.gender,
              ethnicity: undefined,
            },
          })
        })

        it('should correctly remove false items', function () {
          expect(transformedResponse).to.have.property('meta')
          expect(transformedResponse.meta.items.length).to.equal(1)
          expect(transformedResponse.meta).to.deep.equal({
            items: [{
              hideLabel: true,
              label: 'Gender',
              text: mockMove.person.gender.title,
            }],
          })
        })
      })
    })
  })
})
