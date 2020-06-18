const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

const profileToCardComponent = require('./profile-to-card-component')

const mockProfile = {
  id: '12345',
  href: '/move/12345',
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
  person: {
    id: '12345',
    fullname: 'Name, Full',
    image_url: '/path/to/image.jpg',
    date_of_birth: '2000-10-10',
    gender: {
      title: 'Male',
    },
  },
}

describe('Presenters', function () {
  describe('#profileToCardComponent()', function () {
    let transformedResponse

    beforeEach(function () {
      sinon.stub(i18n, 't').returns('__translated__')
      sinon.stub(filters, 'formatDate').returns('18 Jun 1960')
      sinon.stub(filters, 'calculateAge').returns(50)
    })

    context('with default options', function () {
      context('with mock person', function () {
        beforeEach(function () {
          transformedResponse = profileToCardComponent()(mockProfile)
        })

        describe('response', function () {
          it('should contain a href', function () {
            expect(transformedResponse).to.have.property('href')
            expect(transformedResponse.href).to.equal(mockProfile.href)
          })

          it('should contain a title', function () {
            expect(transformedResponse).to.have.property('title')
            expect(transformedResponse.title).to.deep.equal({
              text: mockProfile.person.fullname.toUpperCase(),
            })
          })

          it('should not contain classes', function () {
            expect(transformedResponse).not.to.have.property('classes')
          })

          it('should contain an image path', function () {
            expect(transformedResponse).to.have.property('image_path')
            expect(transformedResponse.image_path).to.equal(
              mockProfile.person.image_url
            )
          })

          it('should contain image alt', function () {
            expect(transformedResponse).to.have.property('image_alt')
            expect(transformedResponse.image_alt).to.equal(
              mockProfile.person.fullname.toUpperCase()
            )
          })

          it('should contain correct meta data', function () {
            expect(transformedResponse).to.have.property('meta')
            expect(transformedResponse.meta).to.deep.equal({
              items: [
                {
                  label: '__translated__',
                  text: '__translated__',
                },
                {
                  label: '__translated__',
                  text: mockProfile.person.gender.title,
                },
              ],
            })
          })

          it('should contain correct tags', function () {
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

          it('should contain correct amount of properties', function () {
            expect(Object.keys(transformedResponse)).to.have.length(6)
          })
        })

        describe('translations', function () {
          it('should translate age label', function () {
            expect(i18n.t.getCall(0)).to.be.calledWithExactly('age', {
              context: 'with_date_of_birth',
              age: 50,
              date_of_birth: '18 Jun 1960',
            })
          })

          it('should translate date of birth label', function () {
            expect(i18n.t.getCall(1)).to.be.calledWithExactly(
              'fields::date_of_birth.label'
            )
          })

          it('should translate gender label', function () {
            expect(i18n.t.getCall(2)).to.be.calledWithExactly(
              'fields::gender.label'
            )
          })

          it('should translate correct number of times', function () {
            expect(i18n.t).to.be.callCount(3)
          })
        })
      })

      context('when meta contains falsey values', function () {
        it('should correctly remove false items', function () {
          const transformedResponse = profileToCardComponent()({
            date_of_birth: '',
            gender: '',
            ethnicity: '',
          })

          expect(transformedResponse).to.have.property('meta')
          expect(transformedResponse.meta.items.length).to.equal(0)
        })

        it('should correctly remove false items', function () {
          const transformedResponse = profileToCardComponent()({
            date_of_birth: null,
            gender: null,
            ethnicity: null,
          })

          expect(transformedResponse).to.have.property('meta')
          expect(transformedResponse.meta.items.length).to.equal(0)
        })

        it('should correctly remove false items', function () {
          const transformedResponse = profileToCardComponent()({
            date_of_birth: undefined,
            gender: undefined,
            ethnicity: undefined,
          })

          expect(transformedResponse).to.have.property('meta')
          expect(transformedResponse.meta.items.length).to.equal(0)
        })
      })

      context('when meta contains some falsey values', function () {
        let transformedResponse

        beforeEach(function () {
          transformedResponse = profileToCardComponent()({
            person: {
              date_of_birth: '',
              gender: mockProfile.person.gender,
            },
            assessment_answers: [],
          })
        })

        it('should correctly remove false items', function () {
          expect(transformedResponse).to.have.property('meta')
          expect(transformedResponse.meta.items.length).to.equal(1)
          expect(transformedResponse.meta).to.deep.equal({
            items: [
              {
                label: '__translated__',
                text: mockProfile.person.gender.title,
              },
            ],
          })
        })
      })

      context('with assessment answers', function () {
        let transformedResponse, mockPersonWithAnswers

        beforeEach(function () {
          mockPersonWithAnswers = {
            href: '/move/12345',
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
                assessment_question_id: '942a634a-2e38-49be-bfe6-ac03979620b3',
                category: 'risk',
              },
              {
                key: 'health_issue',
                title: 'Health issue',
                comments: 'Keeps complaining of headaches',
                date: null,
                expiry_date: null,
                assessment_question_id: '5bb4f1a2-b5e3-49af-a2ef-01b0ae33429d',
                category: 'health',
              },
              {
                key: 'other_risks',
                title: 'Any other risks',
                comments: '',
                date: null,
                expiry_date: null,
                assessment_question_id: '94cf7afd-d2c7-489f-b6c2-a6fb68cc9f15',
                category: 'risk',
              },
              {
                key: 'legal_representation',
                title: 'Solicitor or other legal representation',
                comments: '',
                date: null,
                expiry_date: null,
                assessment_question_id: 'f191fe25-11c8-4195-bbcc-99bf508f293d',
                category: 'court',
              },
              {
                key: 'invalid_answer',
                title: 'Invalid answer',
                comments: '',
                date: null,
                expiry_date: null,
                assessment_question_id: 'f1f1fe15-11c8-4195-bbcc-99bf508f293d',
                category: 'invalid',
              },
              {
                key: 'escape',
                title: 'Escape',
                comments: 'Large poster in cell',
                date: null,
                expiry_date: null,
                assessment_question_id: 'f199c4fe-0134-490c-afa9-a11f3c52c32b',
                category: 'risk',
              },
              {
                key: 'diet_allergy',
                title: 'Special diet or allergy',
                comments: 'Vegan',
                date: null,
                expiry_date: null,
                assessment_question_id: '394d3f05-4d25-43ef-8e7e-6d3a0e742888',
                category: 'health',
              },
            ],
          }

          transformedResponse = profileToCardComponent()(mockPersonWithAnswers)
        })

        it('should correctly filter', function () {
          expect(transformedResponse).to.have.property('tags')
          expect(transformedResponse.tags.items.length).to.equal(5)
        })

        it('should correctly map and sort', function () {
          expect(transformedResponse.tags.items).to.deep.equal([
            {
              href: `${mockPersonWithAnswers.href}#concealed-items`,
              text: 'Concealed items',
              classes: 'app-tag--destructive',
              sortOrder: 1,
            },
            {
              href: `${mockPersonWithAnswers.href}#any-other-risks`,
              text: 'Any other risks',
              classes: 'app-tag--destructive',
              sortOrder: 1,
            },
            {
              href: `${mockPersonWithAnswers.href}#escape`,
              text: 'Escape',
              classes: 'app-tag--destructive',
              sortOrder: 1,
            },
            {
              href: `${mockPersonWithAnswers.href}#health-issue`,
              text: 'Health issue',
              classes: '',
              sortOrder: 2,
            },
            {
              href: `${mockPersonWithAnswers.href}#special-diet-or-allergy`,
              text: 'Special diet or allergy',
              classes: '',
              sortOrder: 2,
            },
          ])
        })
      })
    })

    context('with meta disabled', function () {
      beforeEach(function () {
        transformedResponse = profileToCardComponent({
          showMeta: false,
        })(mockProfile)
      })

      it('should not contain meta items', function () {
        expect(transformedResponse).not.to.have.property('meta')
      })

      it('should contain href', function () {
        expect(transformedResponse).to.have.property('href')
      })

      it('should contain title', function () {
        expect(transformedResponse).to.have.property('title')
      })

      it('should contain tags', function () {
        expect(transformedResponse).to.have.property('tags')
        expect(transformedResponse.tags.items.length).to.equal(3)
      })
    })

    context('with tag disabled', function () {
      beforeEach(function () {
        transformedResponse = profileToCardComponent({
          showTags: false,
        })(mockProfile)
      })

      it('should not contain tags items', function () {
        expect(transformedResponse).not.to.have.property('tags')
      })

      it('should contain href', function () {
        expect(transformedResponse).to.have.property('href')
      })

      it('should contain title', function () {
        expect(transformedResponse).to.have.property('title')
      })

      it('should contain meta', function () {
        expect(transformedResponse).to.have.property('meta')
        expect(transformedResponse.meta.items.length).to.equal(2)
      })
    })

    context('with image disabled', function () {
      beforeEach(function () {
        transformedResponse = profileToCardComponent({
          showImage: false,
        })(mockProfile)
      })

      it('should not contain an image path', function () {
        expect(transformedResponse).not.to.have.property('image_path')
      })

      it('should not contain an image path', function () {
        expect(transformedResponse).not.to.have.property('image_path')
      })

      it('should not contain image alt', function () {
        expect(transformedResponse).not.to.have.property('image_alt')
      })

      it('should contain href', function () {
        expect(transformedResponse).to.have.property('href')
      })

      it('should contain title', function () {
        expect(transformedResponse).to.have.property('title')
      })

      it('should contain meta', function () {
        expect(transformedResponse).to.have.property('meta')
        expect(transformedResponse.meta.items.length).to.equal(2)
      })
    })

    const noPersonResponse = {
      href: undefined,
      classes: 'app-card--placeholder',
      title: { text: '__translated__' },
      meta: { items: [] },
      tags: { items: [] },
      image_path: undefined,
      image_alt: '__translated__',
    }

    context('with no arguments', function () {
      beforeEach(function () {
        transformedResponse = profileToCardComponent()()
      })

      it('should use fallback values', function () {
        expect(transformedResponse).to.deep.equal(noPersonResponse)
      })
    })

    context('with null', function () {
      beforeEach(function () {
        transformedResponse = profileToCardComponent()(null)
      })

      it('should use fallback values', function () {
        expect(transformedResponse).to.deep.equal(noPersonResponse)
      })
    })
  })
})
