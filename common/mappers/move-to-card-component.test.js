const moveToCardComponent = require('./move-to-card-component')
const filters = require('../../config/nunjucks/filters')

const { data } = require('../../test/fixtures/api-client/moves.get.deserialized.json')

describe('Mappers', function () {
  describe('#moveToCardComponent()', function () {
    beforeEach(function () {
      sinon.stub(filters, 'formatDate').returns('18 Jun 1960')
      sinon.stub(filters, 'calculateAge').returns(50)
    })

    context('when provided with a mock move object', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = moveToCardComponent(data[0])
      })

      describe('response', function () {
        it('should contain a href', function () {
          expect(transformedResponse).to.have.property('href')
          expect(transformedResponse.href).to.equal('/moves/2d59052c-86b3-4e50-89f8-28c39c09c106')
        })

        it('should contain a title', function () {
          expect(transformedResponse).to.have.property('title')
          expect(transformedResponse.title).to.deep.equal({
            text: 'HOWE, EDGARDO',
          })
        })

        it('should contain a caption', function () {
          expect(transformedResponse).to.have.property('caption')
          expect(transformedResponse.caption).to.deep.equal({
            text: '2d59052c-86b3-4e50-89f8-28c39c09c106',
          })
        })

        it('should contain correct meta data', function () {
          expect(transformedResponse).to.have.property('meta')
          expect(transformedResponse.meta).to.deep.equal({
            items: [{
              hideLabel: true,
              label: 'Date of birth',
              html: '18 Jun 1960 (Age 50)',
            }],
          })
        })
      })

      context('when meta contains falsey values', function () {
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
    })
  })
})
