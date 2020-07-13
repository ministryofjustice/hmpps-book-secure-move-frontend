const unformat = require('./profile.unformat')

describe('Profile Service', function () {
  describe('#unformat()', function () {
    let profile
    let fields
    let keys
    let unformatted

    before(function () {
      profile = {
        propertyField: 'propertyValue',
        assessment_answers: [
          {
            key: 'assessmentField',
            category: 'assessmentCategory',
            assessment_question_id: 'assessmentId',
            comments: 'assessmentValue',
          },
          {
            key: 'anotherAssessmentField',
            category: 'assessmentCategory',
            assessment_question_id: 'anotherAssessmentId',
            comments: 'anotherAssessmentValue',
          },
          {
            key: 'explicitAssessmentField',
            category: 'explicitAssessmentCategory',
            assessment_question_id: 'explicitAssessmentId',
            comments: 'explicitAssessmentValue',
          },
          {
            key: 'ignored',
            category: 'assessmentCategory',
            assessment_question_id: 'ignoredId',
            comments: 'ignoredValue',
          },
        ],
      }
    })

    beforeEach(function () {
      unformatted = unformat(profile, fields, keys)
    })

    context('when asking for a property', function () {
      before(function () {
        fields = ['propertyField']
      })
      it('should return the value as is', function () {
        expect(unformatted).to.deep.equal({ propertyField: 'propertyValue' })
      })

      context('but it has no value', function () {
        before(function () {
          fields = ['missingPropertyField']
          keys = {
            date: ['missingPropertyField'],
          }
        })
        it('should return undefined', function () {
          expect(unformatted).to.deep.equal({
            missingPropertyField: undefined,
          })
        })
      })
    })

    context('when asking for an assessment', function () {
      before(function () {
        fields = ['assessmentField']
        keys = {
          assessment: ['assessmentField'],
        }
      })
      it('should return the assessment comment and matched values for the assessment category', function () {
        expect(unformatted).to.deep.equal({
          assessmentField: 'assessmentValue',
          assessmentCategory: ['assessmentId'],
        })
      })

      context('but it has no value', function () {
        before(function () {
          fields = ['missingAssessmentField']
          keys = {
            assessment: ['missingAssessmentField'],
          }
        })
        it('should return undefined', function () {
          expect(unformatted).to.deep.equal({
            missingAssessmentField: undefined,
          })
        })
      })

      context('when asking for multiple', function () {
        before(function () {
          fields = ['assessmentField', 'anotherAssessmentField']
          keys = {
            assessment: ['assessmentField', 'anotherAssessmentField'],
          }
        })
        it('should return the assessment comments and matched values for the assessment category', function () {
          expect(unformatted).to.deep.equal({
            assessmentField: 'assessmentValue',
            anotherAssessmentField: 'anotherAssessmentValue',
            assessmentCategory: ['assessmentId', 'anotherAssessmentId'],
          })
        })
      })
    })

    context('when asking for an explicit assessment', function () {
      before(function () {
        fields = ['explicitAssessmentField']
        keys = {
          explicitAssessment: ['explicitAssessmentField'],
        }
      })
      it('should return the assessment comment and matched values for the assessment category', function () {
        expect(unformatted).to.deep.equal({
          explicitAssessmentField: 'explicitAssessmentValue',
          explicitAssessmentField__explicit: 'explicitAssessmentId',
        })
      })

      context('but it has no value', function () {
        before(function () {
          fields = ['missingExplicitAssessmentField']
          keys = {
            explicitAssessment: ['missingExplicitAssessmentField'],
          }
        })
        it('should return undefined and false for explicit value', function () {
          expect(unformatted).to.deep.equal({
            missingExplicitAssessmentField: undefined,
            missingExplicitAssessmentField__explicit: 'false',
          })
        })
      })
    })

    context('when asking for multiple fields of differing type', function () {
      before(function () {
        fields = ['propertyField', 'assessmentField', 'explicitAssessmentField']
        keys = {
          assessment: ['assessmentField'],
          explicitAssessment: ['explicitAssessmentField'],
        }
      })
      it('should return all the expected values', function () {
        expect(unformatted).to.deep.equal({
          propertyField: 'propertyValue',
          assessmentField: 'assessmentValue',
          explicitAssessmentField: 'explicitAssessmentValue',
          assessmentCategory: ['assessmentId'],
          explicitAssessmentField__explicit: 'explicitAssessmentId',
        })
      })
    })
  })
})
