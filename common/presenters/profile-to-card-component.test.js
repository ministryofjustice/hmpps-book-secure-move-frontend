const proxyquire = require('proxyquire').noCallThru()

const i18n = require('../../config/i18n')
const filters = require('../../config/nunjucks/filters')

const frameworkFlagsToTagListStub = sinon.stub().returns(['1', '2', '3'])
const profileToCardComponent = proxyquire('./profile-to-card-component', {
  './framework-flags-to-tag-list': frameworkFlagsToTagListStub,
})

const mockProfile = {
  id: '12345',
  href: '/move/12345',
  person: {
    id: '12345',
    _fullname: 'Name, Full',
    _image_url: '/path/to/image.jpg',
    date_of_birth: '2000-10-10',
    gender: {
      title: 'Male',
    },
    prison_number: 'ABC123',
    police_national_computer: '321CBA',
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
              text: mockProfile.person._fullname,
            })
          })

          it('should not contain classes', function () {
            expect(transformedResponse).not.to.have.property('classes')
          })

          it('should contain an image path', function () {
            expect(transformedResponse).to.have.property('image_path')
            expect(transformedResponse.image_path).to.equal(
              mockProfile.person._image_url
            )
          })

          it('should contain image alt', function () {
            expect(transformedResponse).to.have.property('image_alt')
            expect(transformedResponse.image_alt).to.equal(
              mockProfile.person._fullname
            )
          })

          it('should contain correct meta data', function () {
            expect(transformedResponse).to.have.property('meta')
            expect(transformedResponse.meta).to.deep.equal({
              items: [
                {
                  label: { text: '__translated__' },
                  html: '__translated__',
                },
                {
                  label: { text: '__translated__' },
                  text: mockProfile.person.gender.title,
                },
              ],
            })
          })

          it('should not contain correct tags', function () {
            expect(transformedResponse).not.to.have.property('tags')
          })

          it('should contain inset text', function () {
            expect(transformedResponse).to.have.property('insetText')
            expect(transformedResponse.insetText).to.deep.equal({
              classes: 'govuk-inset-text--compact',
              text: '__translated__',
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

          it('should translate inset text', function () {
            expect(i18n.t).to.be.calledWithExactly('assessment::incomplete')
          })

          it('should translate correct number of times', function () {
            expect(i18n.t).to.be.callCount(4)
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
                label: { text: '__translated__' },
                text: mockProfile.person.gender.title,
              },
            ],
          })
        })
      })

      context('with Person Escort Record', function () {
        context('with `not_started` PER', function () {
          beforeEach(function () {
            transformedResponse = profileToCardComponent()({
              ...mockProfile,
              person_escort_record: {
                status: 'not_started',
              },
            })
          })

          it('should not contain tags', function () {
            expect(transformedResponse).not.to.have.property('tags')
          })

          it('should not contain inset text message', function () {
            expect(transformedResponse).to.have.property('insetText')
            expect(transformedResponse.insetText).to.deep.equal({
              classes: 'govuk-inset-text--compact',
              text: '__translated__',
            })
          })

          it('should translate inset text message', function () {
            expect(i18n.t).to.have.been.calledWithExactly(
              'assessment::incomplete'
            )
          })
        })

        context('with `in_progress` PER', function () {
          beforeEach(function () {
            transformedResponse = profileToCardComponent()({
              ...mockProfile,
              person_escort_record: {
                status: 'in_progress',
              },
            })
          })

          it('should not contain tags', function () {
            expect(transformedResponse).not.to.have.property('tags')
          })

          it('should not contain inset text message', function () {
            expect(transformedResponse).to.have.property('insetText')
            expect(transformedResponse.insetText).to.deep.equal({
              classes: 'govuk-inset-text--compact',
              text: '__translated__',
            })
          })

          it('should translate inset text message', function () {
            expect(i18n.t).to.have.been.calledWithExactly(
              'assessment::incomplete'
            )
          })
        })

        context('with `completed` PER', function () {
          beforeEach(function () {
            transformedResponse = profileToCardComponent()({
              ...mockProfile,
              person_escort_record: {
                status: 'completed',
                flags: ['foo', 'bar'],
              },
            })
          })

          it('should contain tags', function () {
            expect(transformedResponse).to.have.property('tags')
            expect(transformedResponse.tags[0]).to.deep.equal({
              items: ['1', '2', '3'],
            })
          })

          it('should call frameworkFlagsToTagList presenter', function () {
            expect(frameworkFlagsToTagListStub).to.have.been.calledWithExactly({
              flags: ['foo', 'bar'],
              hrefPrefix: '/move/12345',
              includeLink: true,
            })
          })

          it('should not contain inset text message', function () {
            expect(transformedResponse).not.to.have.property('insetText')
          })
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

    context('with existing meta', function () {
      context('with mock person', function () {
        beforeEach(function () {
          transformedResponse = profileToCardComponent({
            meta: [
              {
                label: { text: 'Foo' },
                text: 'Bar',
              },
              {
                label: { text: 'Fizz' },
                text: 'Buzz',
              },
            ],
          })(mockProfile)
        })

        it('should prepend existing meta', function () {
          expect(transformedResponse).to.have.property('meta')
          expect(transformedResponse.meta.items.length).to.equal(4)
          expect(transformedResponse.meta).to.deep.equal({
            items: [
              {
                label: { text: 'Foo' },
                text: 'Bar',
              },
              {
                label: { text: 'Fizz' },
                text: 'Buzz',
              },
              {
                label: { text: '__translated__' },
                html: '__translated__',
              },
              {
                label: { text: '__translated__' },
                text: 'Male',
              },
            ],
          })
        })
      })
    })
    ;[
      {
        property: 'prison_number',
        locationType: 'prison',
        meta: { label: { text: '__translated__' }, text: 'ABC123' },
        undefinedMeta: {
          label: { text: '__translated__' },
          text: '__translated__',
        },
      },
      {
        property: 'police_national_computer',
        locationType: 'other',
        meta: { label: { html: '__translated__' }, text: '321CBA' },
        undefinedMeta: {
          label: { html: '__translated__' },
          text: '__translated__',
        },
      },
    ].forEach(({ property, locationType, meta, undefinedMeta }) => {
      context(`when locationType is "${locationType}"`, function () {
        context(`when profile.${property} is populated`, function () {
          beforeEach(function () {
            transformedResponse = profileToCardComponent({ locationType })(
              mockProfile
            )
          })

          it('adds the correct meta items', function () {
            expect(transformedResponse).to.have.property('meta')
            expect(transformedResponse.meta.items.length).to.equal(3)
            expect(transformedResponse.meta).to.deep.equal({
              items: [
                meta,
                {
                  label: { text: '__translated__' },
                  html: '__translated__',
                },
                {
                  label: { text: '__translated__' },
                  text: 'Male',
                },
              ],
            })
          })
        })

        context(`when profile.${property} is undefined`, function () {
          beforeEach(function () {
            mockProfile.person[property] = undefined
            transformedResponse = profileToCardComponent({ locationType })(
              mockProfile
            )
          })

          it('adds the correct meta items', function () {
            expect(transformedResponse).to.have.property('meta')
            expect(transformedResponse.meta.items.length).to.equal(3)
            expect(transformedResponse.meta).to.deep.equal({
              items: [
                undefinedMeta,
                {
                  label: { text: '__translated__' },
                  html: '__translated__',
                },
                {
                  label: { text: '__translated__' },
                  text: 'Male',
                },
              ],
            })
          })
        })
      })
    })
  })
})
