const personService = require('./person')
const profileService = require('./profile')

describe('Profile Service', function () {
  context('#transform', function () {
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
