const User = require('./user')

describe('User class', function () {
  context('when user has ROLE_PECS_POLICE', function () {
    let user

    beforeEach(function () {
      user = new User({
        user_name: 'Testuser',
        authorities: ['ROLE_PECS_POLICE'],
      })
    })

    it('should contain a username', function () {
      expect(user).to.have.property('userName')
      expect(user.userName).to.equal('Testuser')
    })

    it('should contain correct permission', function () {
      expect(user).to.have.property('permissions')
      expect(user.permissions).to.deep.equal([
        'moves:view:by_location',
        'moves:download:by_location',
        'move:view',
        'move:create',
        'move:cancel',
      ])
    })
  })

  context('when user has ROLE_PECS_SUPPLIER role', function () {
    let user

    beforeEach(function () {
      user = new User({
        user_name: 'Testuser',
        authorities: ['ROLE_PECS_SUPPLIER'],
      })
    })

    it('should contain a username', function () {
      expect(user).to.have.property('userName')
      expect(user.userName).to.equal('Testuser')
    })

    it('should contain correct permission', function () {
      expect(user).to.have.property('permissions')
      expect(user.permissions).to.deep.equal([
        'moves:view:all',
        'moves:download:all',
      ])
    })
  })

  context(
    'when user has both ROLE_PECS_POLICE and ROLE_PECS_SUPPLIER roles',
    function () {
      let user

      beforeEach(function () {
        user = new User({
          user_name: 'Testuser',
          authorities: ['ROLE_PECS_POLICE', 'ROLE_PECS_SUPPLIER'],
        })
      })

      it('should contain a username', function () {
        expect(user).to.have.property('userName')
        expect(user.userName).to.equal('Testuser')
      })

      it('should contain correct permission', function () {
        expect(user).to.have.property('permissions')
        expect(user.permissions).to.deep.equal([
          'moves:view:by_location',
          'moves:download:by_location',
          'move:view',
          'move:create',
          'move:cancel',
          'moves:view:all',
          'moves:download:all',
        ])
      })
    }
  )
})
