const setYouthMove = require('./view.youth-move')

describe('#view', function () {
  describe('#setYouthMove', function () {
    let youthTransferMove
    beforeEach(function () {
      youthTransferMove = {
        to_location: {
          location_type: 'prison',
        },
        from_location: {
          location_type: 'prison',
        },
      }
    })

    context('with youth transfer moves', function () {
      let move
      beforeEach(function () {
        move = {
          ...youthTransferMove,
        }
        setYouthMove(move)
      })
      it('should not update the move when from prison to prison', function () {
        expect(move.move_type).to.be.undefined
      })
    })

    context('with youth transfer moves', function () {
      ;['secure_childrens_home', 'secure_training_centre'].forEach(function (
        youthTransferType
      ) {
        let move
        beforeEach(function () {
          youthTransferMove.from_location.location_type = youthTransferType
          move = {
            ...youthTransferMove,
          }
          setYouthMove(move)
        })
        it(`should upgrade the move when from ${youthTransferType} to prison`, function () {
          expect(move).to.deep.equal({
            ...youthTransferMove,
            move_type: youthTransferType,
          })
        })
      })
    })
  })
})
