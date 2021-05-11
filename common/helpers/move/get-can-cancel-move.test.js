const assert = require('assert')

const getCanCancelMove = require('./get-can-cancel-move')

describe('Move helpers', function () {
  describe('#getCanCancelMove', function () {
    // combinations that should return true
    // anything else should be false
    const validPermutations = [
      {
        permissions: ['move:cancel', 'move:cancel:proposed'],
        allocation: {
          yes: ['proposed'],
          no: ['proposed', 'requested', 'booked'],
        },
      },
      {
        permissions: ['move:cancel'],
        allocation: {
          no: ['requested', 'booked'],
        },
      },
      {
        permissions: ['move:cancel:proposed'],
        allocation: {
          yes: ['proposed'],
          no: ['proposed'],
        },
      },
    ]

    // test options
    // loop by permission, allocation and status
    const permissions = [
      ['move:cancel', 'move:cancel:proposed'],
      ['move:cancel'],
      ['move:cancel:proposed'],
      [],
    ]
    const allocations = ['yes', 'no']
    const statuses = ['proposed', 'requested', 'booked', 'other']

    permissions.forEach(permission => {
      allocations.forEach(allocation => {
        statuses.forEach(status => {
          const permutation = `when user has ${
            permission.length ? permission.join(' and ') : 'no'
          } ${
            permission.length === 1 ? 'permission' : 'permissions'
          } and move is ${
            allocation === 'yes' ? '' : 'not'
          } an allocation and its status is ${status}`

          const matchedPermutation = validPermutations.filter(options => {
            try {
              assert.deepEqual(options.permissions, permission)
              return true
            } catch (err) {
              return false
            }
          })[0]
          let expected = false

          if (matchedPermutation?.allocation?.[allocation]) {
            expected =
              matchedPermutation.allocation[allocation].includes(status)
          }

          const move = {
            status,
            allocation: allocation === 'yes',
          }
          const userPermissions = permission
          const canCancelMove = getCanCancelMove(move, userPermissions)

          describe(permutation, function () {
            it(`should return ${expected}`, function () {
              expect(canCancelMove).to.equal(expected)
            })
          })
        })
      })
    })
  })
})
