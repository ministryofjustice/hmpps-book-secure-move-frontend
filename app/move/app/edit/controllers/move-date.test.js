const CreateMoveDate = require('../../new/controllers/move-date')

const UpdateBaseController = require('./base')
const MoveDateController = require('./move-date')

const MixinProto = CreateMoveDate.prototype

const controller = new MoveDateController({ route: '/' })
const ownProto = Object.getPrototypeOf(controller)

describe('Move controllers', function () {
  describe('Update move date controller', function () {
    it('should extend UpdateBaseController', function () {
      expect(Object.getPrototypeOf(ownProto)).to.equal(
        UpdateBaseController.prototype
      )
    })

    describe('When mixing in create controller', function () {
      it('should copy middlewareSetup from CreateMoveDate', function () {
        expect(controller.middlewareSetup).to.exist.and.equal(
          MixinProto.middlewareSetup
        )
      })

      it('should copy setDateType from CreateMoveDate', function () {
        expect(controller.setDateType).to.exist.and.equal(
          MixinProto.setDateType
        )
      })

      it('should copy process from CreateMoveDate', function () {
        expect(controller.process).to.exist.and.equal(MixinProto.process)
      })

      it('should copy successHandler from CreateMoveDate', function () {
        expect(controller.successHandler).to.exist.and.equal(
          MixinProto.successHandler
        )
      })

      it('should only have the expected methods of its own', function () {
        const ownMethods = [
          'setNextStep',
          'setButtonText',
          'getUpdateValues',
          'saveValues',
          'isPrisonTransfer',
        ]
        const mixedinMethods = Object.getOwnPropertyNames(MixinProto)
        const ownProps = Object.getOwnPropertyNames(ownProto).filter(
          prop => !mixedinMethods.includes(prop) || ownMethods.includes(prop)
        )

        expect(ownProps).to.deep.equal(ownMethods)
      })
    })

    describe('#getUpdateValues', function () {
      const today = '2019-10-02'
      const tomorrow = '2019-10-03'
      let req = {}
      const res = {
        locals: {
          TODAY: today,
          TOMORROW: tomorrow,
        },
      }

      beforeEach(function () {
        req = {
          form: {
            values: {
              date: '2019-10-04',
            },
          },
          getMove: sinon.stub(),
        }
      })

      context('When no move exists', function () {
        it('should return an empty object', function () {
          expect(controller.getUpdateValues(req, res)).to.deep.equal({})
        })
      })

      context('When a move exists without a move type', function () {
        const move = { id: '#move', date: '2019-10-04' }

        beforeEach(function () {
          req.getMove.returns(move)
        })

        context('When not today or tomorrow', function () {
          it('should return just the move type', function () {
            expect(controller.getUpdateValues(req, res)).to.deep.equal({
              date_custom: '4 Oct 2019',
              date_type: 'custom',
            })
          })
        })

        context('When a today', function () {
          beforeEach(function () {
            move.date = today
          })

          it('should return just the move type', function () {
            expect(controller.getUpdateValues(req, res)).to.deep.equal({
              date_type: 'today',
            })
          })
        })
        context('When a tomorrow', function () {
          beforeEach(function () {
            move.date = tomorrow
          })

          it('should return just the move type', function () {
            expect(controller.getUpdateValues(req, res)).to.deep.equal({
              date_type: 'tomorrow',
            })
          })
        })
      })
    })

    describe('#saveValues', function () {
      let req
      const res = {}
      let nextSpy
      const move = { id: '#move', date: '2019-10-04' }
      const sessionModel = { set: sinon.stub() }

      beforeEach(function () {
        sessionModel.set.resetHistory()
        sinon.stub(UpdateBaseController.prototype, 'saveMove')
      })

      context('when move type is prison transfer', function () {
        beforeEach(function () {
          req = {
            form: {
              values: {
                date: '2021-08-02',
              },
            },
            sessionModel,
            getMove: sinon.stub(),
          }
          nextSpy = sinon.spy()
          move.move_type = 'prison_transfer'
          req.getMove.returns(move)
          controller.saveValues(req, res, nextSpy)
        })
        it('should set move date in session model', function () {
          expect(sessionModel.set).to.be.calledOnce
        })

        it('should invoke next', function () {
          expect(nextSpy).to.be.called
        })

        it('should not call base’s saveMove', function () {
          expect(UpdateBaseController.prototype.saveMove).to.not.be.called
        })
      })
      context('when move type is not prison transfer', function () {
        beforeEach(function () {
          req = {
            form: {
              values: {
                date: '2021-08-02',
              },
            },
            sessionModel,
            getMove: sinon.stub(),
          }
          nextSpy = sinon.spy()
          move.move_type = 'hospital'
          req.getMove.returns(move)
          controller.saveValues(req, res, nextSpy)
        })
        it('should not set move date in session model', function () {
          expect(sessionModel.set).to.not.be.called
        })

        it('should not invoke next', function () {
          expect(nextSpy).to.not.be.called
        })

        it('should call base’s saveMove', function () {
          expect(
            UpdateBaseController.prototype.saveMove
          ).to.be.calledOnceWithExactly(req, res, nextSpy)
        })
      })
    })
  })
})
