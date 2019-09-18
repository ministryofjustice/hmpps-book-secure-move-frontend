const moveToCardComponent = require('./move-to-card-component')

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

const mockMove = {
  id: '12345',
  reference: 'AB12FS45',
  person: {
    fullname: 'Name, Full',
    date_of_birth: '2000-10-10',
    gender: {
      title: 'Male',
    },
    assessment_answers: [
      {
        key: 'concealed_items',
        title: 'Concealed items',
        category: 'risk',
      },
      {
        key: 'health_issue',
        title: 'Health issue',
        category: 'health',
      },
      {
        key: 'other_risks',
        title: 'Any other risks',
        category: 'risk',
      },
      {
        key: 'legal_representation',
        title: 'Solicitor or other legal representation',
        category: 'court',
      },
    ],
  },
}

describe('Presenters', function() {
  describe('#moveToCardComponent()', function() {
    let transformedResponse

    beforeEach(function() {
      sinon.stub(i18n, 't').returns('__translated__')
      sinon.stub(filters, 'formatDate').returns('18 Jun 1960')
      sinon.stub(filters, 'calculateAge').returns(50)
    })

    context('with default options', function() {
      context('with mock move', function() {
        beforeEach(function() {
          transformedResponse = moveToCardComponent()(mockMove)
        })

        describe('response', function() {
          it('should contain a href', function() {
            expect(transformedResponse).to.have.property('href')
            expect(transformedResponse.href).to.equal('/move/12345')
          })

          it('should contain a title', function() {
            expect(transformedResponse).to.have.property('title')
            expect(transformedResponse.title).to.deep.equal({
              text: mockMove.person.fullname.toUpperCase(),
            })
          })

          it('should contain a caption', function() {
            expect(transformedResponse).to.have.property('caption')
            expect(transformedResponse.caption).to.deep.equal({
              text: `__translated__`,
            })
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
                  text: mockMove.person.gender.title,
                },
              ],
            })
          })

          it('should contain correct tags', function() {
            expect(transformedResponse).to.have.property('tags')
            expect(transformedResponse.tags).to.deep.equal({
              items: [
                {
                  href: '/move/12345#concealed-items',
                  text: 'Concealed items',
                  classes: 'app-tag--destructive',
                  sortOrder: 1,
                },
                {
                  href: '/move/12345#any-other-risks',
                  text: 'Any other risks',
                  classes: 'app-tag--destructive',
                  sortOrder: 1,
                },
                {
                  href: '/move/12345#health-issue',
                  text: 'Health issue',
                  classes: '',
                  sortOrder: 2,
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

          it('should translate move reference', function() {
            expect(i18n.t.getCall(3)).to.be.calledWithExactly(
              'moves::move_reference',
              { reference: 'AB12FS45' }
            )
          })

          it('should translate correct number of times', function() {
            expect(i18n.t).to.be.callCount(4)
          })
        })
      })

      context('when meta contains all falsey values', function() {
        let transformedResponse

        beforeEach(function() {
          transformedResponse = moveToCardComponent()({
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

        it('should correctly remove false items', function() {
          expect(transformedResponse).to.have.property('meta')
          expect(transformedResponse.meta.items.length).to.equal(0)
        })
      })

      context('when meta contains some falsey values', function() {
        let transformedResponse

        beforeEach(function() {
          transformedResponse = moveToCardComponent()({
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

        it('should correctly remove false items', function() {
          expect(transformedResponse).to.have.property('meta')
          expect(transformedResponse.meta.items.length).to.equal(1)
          expect(transformedResponse.meta).to.deep.equal({
            items: [
              {
                label: '__translated__',
                text: mockMove.person.gender.title,
              },
            ],
          })
        })
      })

      context('with assessment answers', function() {
        let transformedResponse, mockMove

        beforeEach(function() {
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

          transformedResponse = moveToCardComponent()(mockMove)
        })

        it('should correctly filter', function() {
          expect(transformedResponse).to.have.property('tags')
          expect(transformedResponse.tags.items.length).to.equal(5)
        })

        it('should correctly map and sort', function() {
          expect(transformedResponse.tags.items).to.deep.equal([
            {
              href: `/move/${mockMove.id}#concealed-items`,
              text: 'Concealed items',
              classes: 'app-tag--destructive',
              sortOrder: 1,
            },
            {
              href: `/move/${mockMove.id}#any-other-risks`,
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
              href: `/move/${mockMove.id}#health-issue`,
              text: 'Health issue',
              classes: '',
              sortOrder: 2,
            },
            {
              href: `/move/${mockMove.id}#special-diet-or-allergy`,
              text: 'Special diet or allergy',
              classes: '',
              sortOrder: 2,
            },
          ])
        })
      })
    })

    context('with meta disabled', function() {
      beforeEach(function() {
        transformedResponse = moveToCardComponent({
          showMeta: false,
        })(mockMove)
      })

      it('should not contain meta items', function() {
        expect(transformedResponse).to.have.property('meta')
        expect(transformedResponse.meta.items).to.be.undefined
      })

      it('should contain href', function() {
        expect(transformedResponse).to.have.property('href')
      })

      it('should contain title', function() {
        expect(transformedResponse).to.have.property('title')
      })

      it('should contain caption', function() {
        expect(transformedResponse).to.have.property('caption')
      })

      it('should contain tags', function() {
        expect(transformedResponse).to.have.property('tags')
        expect(transformedResponse.tags.items.length).to.equal(3)
      })
    })

    context('with tag disabled', function() {
      beforeEach(function() {
        transformedResponse = moveToCardComponent({
          showTags: false,
        })(mockMove)
      })

      it('should not contain tags items', function() {
        expect(transformedResponse).to.have.property('tags')
        expect(transformedResponse.tags.items).to.be.undefined
      })

      it('should contain href', function() {
        expect(transformedResponse).to.have.property('href')
      })

      it('should contain title', function() {
        expect(transformedResponse).to.have.property('title')
      })

      it('should contain caption', function() {
        expect(transformedResponse).to.have.property('caption')
      })

      it('should contain meta', function() {
        expect(transformedResponse).to.have.property('meta')
        expect(transformedResponse.meta.items.length).to.equal(2)
      })
    })
  })
})
