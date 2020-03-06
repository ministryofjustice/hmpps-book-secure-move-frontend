const personToCardComponent = require('./person-to-card-component')

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

const mockPerson = {
  fullname: 'Name, Full',
  image_url: '/path/to/image.jpg',
  date_of_birth: '2000-10-10',
  gender: {
    title: 'Male',
  },
}

describe('Presenters', function() {
  describe('#personToCardComponent()', function() {
    let transformedResponse

    beforeEach(function() {
      sinon.stub(i18n, 't').returns('__translated__')
      sinon.stub(filters, 'formatDate').returns('18 Jun 1960')
      sinon.stub(filters, 'calculateAge').returns(50)
    })

    context('with default options', function() {
      context('with mock person', function() {
        beforeEach(function() {
          transformedResponse = personToCardComponent(mockPerson)
        })

        describe('response', function() {
          it('should contain a title', function() {
            expect(transformedResponse).to.have.property('title')
            expect(transformedResponse.title).to.deep.equal({
              text: mockPerson.fullname.toUpperCase(),
            })
          })

          it('should contain an image path', function() {
            expect(transformedResponse).to.have.property('image_path')
            expect(transformedResponse.image_path).to.equal(
              mockPerson.image_url
            )
          })

          it('should contain correct meta data', function() {
            expect(transformedResponse).to.have.property('meta')
            expect(transformedResponse.meta).to.deep.equal({
              items: [
                {
                  label: '__translated__',
                  text: '__translated__',
                },
                {
                  label: '__translated__',
                  text: mockPerson.gender.title,
                },
              ],
            })
          })
        })

        describe('translations', function() {
          it('should translate age label', function() {
            expect(i18n.t.getCall(0)).to.be.calledWithExactly('age', {
              context: 'with_date_of_birth',
              age: 50,
              date_of_birth: '18 Jun 1960',
            })
          })

          it('should translate date of birth label', function() {
            expect(i18n.t.getCall(1)).to.be.calledWithExactly(
              'fields::date_of_birth.label'
            )
          })

          it('should translate gender label', function() {
            expect(i18n.t.getCall(2)).to.be.calledWithExactly(
              'fields::gender.label'
            )
          })

          it('should translate correct number of times', function() {
            expect(i18n.t).to.be.callCount(3)
          })
        })
      })

      context('when meta contains all falsey values', function() {
        let transformedResponse

        beforeEach(function() {
          transformedResponse = personToCardComponent({
            last_name: 'Jones',
            first_names: 'Steve',
            date_of_birth: '',
            gender: false,
            ethnicity: undefined,
            assessment_answers: [],
          })
        })

        it('should correctly remove false items', function() {
          expect(transformedResponse).to.have.property('meta')
          expect(transformedResponse.meta.items.length).to.equal(0)
        })
      })

      context('when meta contains some falsey values', function() {
        let transformedResponse

        beforeEach(function() {
          transformedResponse = personToCardComponent({
            last_name: 'Jones',
            first_names: 'Steve',
            date_of_birth: '',
            gender: mockPerson.gender,
            ethnicity: undefined,
            assessment_answers: [],
          })
        })

        it('should correctly remove false items', function() {
          expect(transformedResponse).to.have.property('meta')
          expect(transformedResponse.meta.items.length).to.equal(1)
          expect(transformedResponse.meta).to.deep.equal({
            items: [
              {
                label: '__translated__',
                text: mockPerson.gender.title,
              },
            ],
          })
        })
      })
    })
  })
})
