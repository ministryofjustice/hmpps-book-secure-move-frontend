const moveToCardComponent = require('./move-to-card-component')

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')
const personService = require('../services/person')

const {
  data: mockMove,
} = require('../../test/fixtures/api-client/move.get.deserialized.json')
const fullname = `${mockMove.person.last_name}, ${mockMove.person.first_names}`

describe('Presenters', function () {
  describe('#moveToCardComponent()', function () {
    beforeEach(function () {
      sinon.stub(i18n, 't').returns('__translated__')
      sinon.stub(filters, 'formatDate').returns('18 Jun 1960')
      sinon.stub(filters, 'calculateAge').returns(50)
      sinon.stub(personService, 'getFullname').returns(fullname)
    })

    context('when provided with a mock move object', function () {
      let transformedResponse

      beforeEach(function () {
        transformedResponse = moveToCardComponent(mockMove)
      })

      describe('response', function () {
        it('should contain a href', function () {
          expect(transformedResponse).to.have.property('href')
          expect(transformedResponse.href).to.equal(`/move/${mockMove.id}`)
        })

        it('should contain a title', function () {
          expect(transformedResponse).to.have.property('title')
          expect(transformedResponse.title).to.deep.equal({
            text: fullname.toUpperCase(),
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
            items: [
              {
                hideLabel: true,
                label: '__translated__',
                html: '18 Jun 1960 (__translated__ 50)',
              },
              {
                hideLabel: true,
                label: '__translated__',
                text: mockMove.person.gender.title,
              },
              {
                hideLabel: true,
                label: '__translated__',
                text: mockMove.person.ethnicity.title,
              },
            ],
          })
        })

        it('should contain correct tags', function () {
          const moveId = mockMove.id
          expect(transformedResponse).to.have.property('tags')
          expect(transformedResponse.tags).to.deep.equal({
            items: [
              {
                href: `/move/${moveId}#concealed_items`,
                text: 'Concealed items',
                classes: 'app-tag--destructive',
                sortOrder: 1,
              },
              {
                href: `/move/${moveId}#other_risks`,
                text: 'Any other risks',
                classes: 'app-tag--destructive',
                sortOrder: 1,
              },
              {
                href: `/move/${moveId}#health_issue`,
                text: 'Health issue',
                classes: '',
                sortOrder: 2,
              },
            ],
          })
        })
      })

      describe('translations', function () {
        it('should translate date of birth label', function () {
          expect(i18n.t.firstCall).to.be.calledWithExactly(
            'fields::date_of_birth.label'
          )
        })

        it('should translate age label', function () {
          expect(i18n.t.secondCall).to.be.calledWithExactly('age')
        })

        it('should translate gender label', function () {
          expect(i18n.t.thirdCall).to.be.calledWithExactly(
            'fields::gender.label'
          )
        })

        it('should translate ethnicity label', function () {
          expect(i18n.t.getCall(3)).to.be.calledWithExactly(
            'fields::ethnicity.label'
          )
        })

        it('should translate correct number of times', function () {
          expect(i18n.t).to.be.callCount(4)
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
              assessment_answers: [],
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
              assessment_answers: [],
            },
          })
        })

        it('should correctly remove false items', function () {
          expect(transformedResponse).to.have.property('meta')
          expect(transformedResponse.meta.items.length).to.equal(1)
          expect(transformedResponse.meta).to.deep.equal({
            items: [
              {
                hideLabel: true,
                label: '__translated__',
                text: mockMove.person.gender.title,
              },
            ],
          })
        })
      })

      context('with assessment answers', function () {
        let transformedResponse, mockMove

        beforeEach(function () {
          mockMove = {
            id: 'a81974e4-e1a7-4cee-81e9-b4ea2ab6d158',
            person: {
              last_name: 'Jones',
              first_names: 'Steve',
              date_of_birth: '',
              assessment_answers: [
                {
                  key: 'concealed_items',
                  title: 'Concealed items',
                  comments: 'Penknife found in trouser pockets',
                  date: null,
                  expiry_date: null,
                  assessment_question_id:
                    '942a634a-2e38-49be-bfe6-ac03979620b3',
                  category: 'risk',
                },
                {
                  key: 'health_issue',
                  title: 'Health issue',
                  comments: 'Keeps complaining of headaches',
                  date: null,
                  expiry_date: null,
                  assessment_question_id:
                    '5bb4f1a2-b5e3-49af-a2ef-01b0ae33429d',
                  category: 'health',
                },
                {
                  key: 'other_risks',
                  title: 'Any other risks',
                  comments: '',
                  date: null,
                  expiry_date: null,
                  assessment_question_id:
                    '94cf7afd-d2c7-489f-b6c2-a6fb68cc9f15',
                  category: 'risk',
                },
                {
                  key: 'legal_representation',
                  title: 'Solicitor or other legal representation',
                  comments: '',
                  date: null,
                  expiry_date: null,
                  assessment_question_id:
                    'f191fe25-11c8-4195-bbcc-99bf508f293d',
                  category: 'court',
                },
                {
                  key: 'invalid_answer',
                  title: 'Invalid answer',
                  comments: '',
                  date: null,
                  expiry_date: null,
                  assessment_question_id:
                    'f1f1fe15-11c8-4195-bbcc-99bf508f293d',
                  category: 'invalid',
                },
                {
                  key: 'escape',
                  title: 'Escape',
                  comments: 'Large poster in cell',
                  date: null,
                  expiry_date: null,
                  assessment_question_id:
                    'f199c4fe-0134-490c-afa9-a11f3c52c32b',
                  category: 'risk',
                },
                {
                  key: 'diet_allergy',
                  title: 'Special diet or allergy',
                  comments: 'Vegan',
                  date: null,
                  expiry_date: null,
                  assessment_question_id:
                    '394d3f05-4d25-43ef-8e7e-6d3a0e742888',
                  category: 'health',
                },
              ],
            },
          }

          transformedResponse = moveToCardComponent(mockMove)
        })

        it('should correctly filter', function () {
          expect(transformedResponse).to.have.property('tags')
          expect(transformedResponse.tags.items.length).to.equal(5)
        })

        it('should correctly map and sort', function () {
          expect(transformedResponse.tags.items).to.deep.equal([
            {
              href: `/move/${mockMove.id}#concealed_items`,
              text: 'Concealed items',
              classes: 'app-tag--destructive',
              sortOrder: 1,
            },
            {
              href: `/move/${mockMove.id}#other_risks`,
              text: 'Any other risks',
              classes: 'app-tag--destructive',
              sortOrder: 1,
            },
            {
              href: `/move/${mockMove.id}#escape`,
              text: 'Escape',
              classes: 'app-tag--destructive',
              sortOrder: 1,
            },
            {
              href: `/move/${mockMove.id}#health_issue`,
              text: 'Health issue',
              classes: '',
              sortOrder: 2,
            },
            {
              href: `/move/${mockMove.id}#diet_allergy`,
              text: 'Special diet or allergy',
              classes: '',
              sortOrder: 2,
            },
          ])
        })
      })
    })
  })
})
