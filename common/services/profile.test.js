const proxyquire = require('proxyquire')

const apiClient = require('../lib/api-client')()

const personService = require('./person')
const unformatStub = sinon.stub()

const profileService = proxyquire('./profile', {
  './profile/profile.unformat': unformatStub,
})
describe('Profile Service', function () {
  context('#transform', function () {
    context('When profile is not a valid object', function () {
      it('should leave profile untouched', function () {
        const profile = profileService.transform(null)
        expect(profile).to.be.null
      })
    })

    context('When profile is valid object', function () {
      const mockPerson = {
        id: '__person__',
      }
      let profile
      beforeEach(function () {
        sinon.stub(personService, 'transform').callsFake(person => {
          return {
            ...person,
            foo: 'bar',
          }
        })
        profile = profileService.transform({
          id: '__profile__',
          person: mockPerson,
        })
      })

      it('should transform the person', function () {
        expect(personService.transform).to.be.calledOnceWithExactly(mockPerson)
      })

      it('should update the person object on the profile', function () {
        expect(profile.person).to.deep.equal({
          ...mockPerson,
          foo: 'bar',
        })
      })
    })
  })

  describe('#create()', function () {
    const profileData = {
      assessment_answer: [],
    }
    const mockResponse = {
      data: {
        id: '#createdProfile',
      },
    }

    context('without person ID', function () {
      it('should reject with error', function () {
        return expect(profileService.create()).to.be.rejectedWith(
          'No Person ID supplied'
        )
      })
    })

    context('with person ID', function () {
      beforeEach(async function () {
        sinon.spy(apiClient, 'one')
        sinon.spy(apiClient, 'all')
        sinon.stub(apiClient, 'post').resolves(mockResponse)
        sinon.stub(profileService, 'transform')

        await profileService.create('#personId', profileData)
      })

      it('should call create endpoint with data', function () {
        expect(apiClient.one).to.be.calledOnceWithExactly('person', '#personId')
        expect(apiClient.all).to.be.calledOnceWithExactly('profile')
        expect(apiClient.post).to.be.calledOnceWithExactly(profileData)
      })

      it('should transform profile', function () {
        expect(profileService.transform).to.be.calledOnceWithExactly({
          id: '#createdProfile',
        })
      })
    })
  })

  describe('#update()', function () {
    const profileData = {
      id: '#profileId',
      assessment_answer: [],
      person: {
        id: '#personId',
      },
    }
    const mockResponse = {
      data: {
        id: '#updatedProfile',
      },
    }

    context('without person ID', function () {
      it('should reject with error', function () {
        return expect(profileService.update()).to.be.rejectedWith(
          'No Person ID supplied'
        )
      })
    })

    context('with person ID', function () {
      beforeEach(async function () {
        sinon.spy(apiClient, 'one')
        sinon.stub(apiClient, 'patch').resolves(mockResponse)
        sinon.stub(profileService, 'transform')

        await profileService.update(profileData)
      })

      it('should call patch endpoint with data', function () {
        expect(apiClient.one.firstCall).to.be.calledWithExactly(
          'person',
          '#personId'
        )
        expect(apiClient.one.secondCall).to.be.calledWithExactly(
          'profile',
          '#profileId'
        )
        expect(apiClient.patch).to.be.calledOnceWithExactly(profileData)
      })

      it('should transform profile', function () {
        expect(profileService.transform).to.be.calledOnceWithExactly({
          id: '#updatedProfile',
        })
      })
    })
  })

  describe('#unformat()', function () {
    const assessmentKeys = [
      // court
      'solicitor',
      'interpreter',
      'other_court',
      // risk
      'violent',
      'escape',
      'hold_separately',
      'self_harm',
      'concealed_items',
      'other_risks',
      // health
      'special_diet_or_allergy',
      'health_issue',
      'medication',
      'wheelchair',
      'pregnant',
      'other_health',
      'special_vehicle',
    ]
    const explicitKeys = ['special_vehicle', 'not_to_be_released']
    const defaultKeys = {
      assessment: assessmentKeys,
      explicitAssessment: explicitKeys,
    }

    const profile = { id: '#profileId' }
    const fields = ['foo']
    let keys

    beforeEach(function () {
      unformatStub.resetHistory()
      profileService.unformat(profile, fields, keys)
    })

    context('when called with no keys', function () {
      before(function () {
        keys = undefined
      })

      it('should call profile.unformat with expected args', function () {
        expect(unformatStub).to.be.calledOnceWithExactly(
          profile,
          fields,
          defaultKeys
        )
      })
    })

    context('when called with empty keys', function () {
      before(function () {
        keys = {}
      })

      it('should call profile.unformat with expected args', function () {
        expect(unformatStub).to.be.calledOnceWithExactly(
          profile,
          fields,
          defaultKeys
        )
      })
    })

    context('when called with keys', function () {
      before(function () {
        keys = {
          assessment: ['assessmentField'],
          explicitAssessment: ['explicitAssessmentField'],
        }
      })

      it('should call profile.unformat with expected args', function () {
        expect(unformatStub).to.be.calledOnceWithExactly(profile, fields, keys)
      })
    })

    context('when called with keys with some missing properties', function () {
      before(function () {
        keys = {
          explicitAssessment: ['explicitAssessmentField'],
        }
      })

      it('should call profile.unformat with expected args', function () {
        expect(unformatStub).to.be.calledOnceWithExactly(profile, fields, {
          ...defaultKeys,
          ...keys,
        })
      })
    })
  })
})
