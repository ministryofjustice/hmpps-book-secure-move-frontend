const CreateMoveDetails = require('../../new/controllers/move-details')

const UpdateBaseController = require('./base')
const MoveDetailsController = require('./move-details')

const MixinProto = CreateMoveDetails.prototype

const controller = new MoveDetailsController({ route: '/' })
const ownProto = Object.getPrototypeOf(controller)

describe('Move controllers', function () {
  describe('Update move details controller', function () {
    it('should extend UpdateBaseController', function () {
      expect(Object.getPrototypeOf(ownProto)).to.equal(
        UpdateBaseController.prototype
      )
    })

    describe('When mixing in create controller', function () {
      it('should copy configure from CreateMoveDetails', function () {
        expect(controller.configure).to.exist.and.equal(MixinProto.configure)
      })

      it('should copy setMoveTypes from CreateMoveDetails', function () {
        expect(controller.setMoveTypes).to.exist.and.equal(
          MixinProto.setMoveTypes
        )
      })

      it('should copy process from CreateMoveDetails', function () {
        expect(controller.process).to.exist.and.equal(MixinProto.process)
      })

      it('should copy successHandler from CreateMoveDetails', function () {
        expect(controller.successHandler).to.exist.and.equal(
          MixinProto.successHandler
        )
      })

      it('should only have the expected methods of its own', function () {
        const ownMethods = [
          'middlewareSetup',
          'getUpdateValues',
          'filterMoveTypes',
          'saveValues',
        ]
        const mixedinMethods = Object.getOwnPropertyNames(MixinProto)
        const ownProps = Object.getOwnPropertyNames(ownProto).filter(
          prop => !mixedinMethods.includes(prop) || ownMethods.includes(prop)
        )
        expect(ownProps).to.deep.equal(ownMethods)
      })
    })

    describe('#middlewareSetup', function () {
      beforeEach(function () {
        sinon.stub(MixinProto, 'middlewareSetup')
        sinon.stub(controller, 'use')
        controller.middlewareSetup()
      })

      context('When middlewareSetup is called', function () {
        it('should invoke the mixin controller’s middlewareSetup with the correct context', function () {
          expect(MixinProto.middlewareSetup).to.be.calledOnceWithExactly()
          expect(MixinProto.middlewareSetup.getCall(0).thisValue).to.equal(
            controller
          )
        })

        it('should use the filterMoveTypes middleware', function () {
          expect(controller.use).to.be.calledOnceWithExactly(
            controller.filterMoveTypes
          )
        })
      })
    })

    describe('#getUpdateValues', function () {
      let req = {}
      const res = {}
      beforeEach(function () {
        req = {
          getMove: sinon.stub(),
        }
      })

      context('When no move exists', function () {
        it('should return an empty object', function () {
          expect(controller.getUpdateValues(req, res)).to.deep.equal({})
        })
      })

      context('When a move exists without a location id', function () {
        const move = { move_type: '#move_type' }
        beforeEach(function () {
          req.getMove.returns(move)
        })
        it('should return just the move type', function () {
          expect(controller.getUpdateValues(req, res)).to.deep.equal({
            move_type: '#move_type',
          })
        })
      })

      context('When a move exists with a location id', function () {
        const move = {
          move_type: '#move_type',
          to_location: {
            id: '#to_location_id',
          },
        }
        beforeEach(function () {
          req.getMove.returns(move)
        })
        it('should return the move type and to_location', function () {
          expect(controller.getUpdateValues(req, res)).to.deep.equal({
            move_type: '#move_type',
            'to_location_#move_type': '#to_location_id',
          })
        })
      })

      context('When a move exists with additonal information', function () {
        const move = {
          move_type: '#move_type',
          additional_information: '#additionalInfo',
        }
        beforeEach(function () {
          req.getMove.returns(move)
        })
        it('should return the move type and the comments for that move type', function () {
          expect(controller.getUpdateValues(req, res)).to.deep.equal({
            move_type: '#move_type',
            additional_information: '#additionalInfo',
            '#move_type_comments': '#additionalInfo',
          })
        })
      })
    })

    describe('#filterMoveTypes', function () {
      let req = {}
      const res = {}
      let nextSpy
      beforeEach(function () {
        req = {
          getMove: sinon.stub().returns({ move_type: '#moveType' }),
          form: {
            options: {
              fields: {
                move_type: {
                  items: [
                    {
                      value: 'foo',
                    },
                    {
                      value: 'bar',
                    },
                    {
                      value: '#moveType',
                    },
                  ],
                },
              },
            },
          },
        }
        nextSpy = sinon.spy()
        controller.filterMoveTypes(req, res, nextSpy)
      })

      context('When filterMoveTypes is called', function () {
        it('should remove the irrelevant options from move type', function () {
          expect(req.form.options.fields.move_type.items).to.deep.equal([
            {
              value: '#moveType',
            },
          ])
        })

        it('should call the next method', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#saveValues', function () {
      let req = {}
      const res = {}
      let nextSpy, moveService

      beforeEach(function () {
        moveService = {
          redirect: sinon.stub(),
          update: sinon.stub(),
        }
        req = {
          session: {
            user: {
              fullname: 'Bob Bobbins',
              username: '#username',
              userId: '#userId',
            },
          },
          getMoveId: () => '#moveId',
          getMove: sinon.stub().returns({
            move_type: 'faraway',
          }),
          form: {
            values: {
              prison_recall_comments: '#additionalInformation',
              video_remand_comments: '#additionalInformation',
              to_location_faraway: '#toLocation',
            },
          },
          t: sinon.stub().returnsArg(0),
          services: {
            move: moveService,
          },
        }
        nextSpy = sinon.spy()
      })

      context(
        'When the move_type is not prison_recall or video_remand',
        function () {
          context('and the to location has changed', function () {
            beforeEach(async function () {
              req.getMove.returns({
                move_type: 'faraway',
                to_location: {
                  id: '#originalLocation',
                },
              })
              await controller.saveValues(req, res, nextSpy)
            })

            it('should call set the notes property', function () {
              expect(req.t).to.be.calledOnceWithExactly(
                'moves::redirect_notes',
                req.session.user
              )
            })

            it('should call move service’s redirect method', function () {
              expect(moveService.redirect).to.be.calledOnceWithExactly({
                id: '#moveId',
                notes: 'moves::redirect_notes',
                to_location: {
                  id: '#toLocation',
                },
              })
            })

            it('should invoke next', function () {
              expect(nextSpy).to.be.calledOnceWithExactly()
            })
          })

          context('and the to location has not changed', function () {
            beforeEach(async function () {
              req.getMove.returns({
                move_type: 'faraway',
                to_location: {
                  id: '#toLocation',
                },
              })
              await controller.saveValues(req, res, nextSpy)
            })

            it('should not call move service’s redirect method', function () {
              expect(moveService.redirect).to.not.be.called
            })

            it('should invoke next', function () {
              expect(nextSpy).to.be.calledOnceWithExactly()
            })
          })

          context('and the move service errors', function () {
            const error = new Error()
            beforeEach(async function () {
              req.services.move.redirect = sinon.stub().throws(error)
              await controller.saveValues(req, res, nextSpy)
            })

            it('should invoke next with error', function () {
              expect(nextSpy).to.be.calledOnceWithExactly(error)
            })
          })
        }
      )

      const checkMoveTypeWithAdditionalInfo = moveType => {
        context(`When the move_type is ${moveType}`, function () {
          context('and the comments has changed', function () {
            beforeEach(async function () {
              req.getMove.returns({
                move_type: moveType,
                additional_information: '#oldInfo',
              })
              await controller.saveValues(req, res, nextSpy)
            })

            it('should call move service’s update method', function () {
              expect(moveService.update).to.be.calledOnceWithExactly({
                id: '#moveId',
                additional_information: '#additionalInformation',
              })
            })

            it('should invoke next', function () {
              expect(nextSpy).to.be.calledOnceWithExactly()
            })
          })

          context('and the additional comments have not changed', function () {
            beforeEach(async function () {
              req.getMove.returns({
                move_type: moveType,
                additional_information: '#additionalInformation',
              })
              await controller.saveValues(req, res, nextSpy)
            })

            it('should not call move service’s update method', function () {
              expect(moveService.update).to.not.be.called
            })

            it('should invoke next', function () {
              expect(nextSpy).to.be.calledOnceWithExactly()
            })
          })

          context('and the move service errors', function () {
            const error = new Error()

            beforeEach(async function () {
              req.getMove.returns({
                move_type: moveType,
                additional_information: '#oldInformation',
              })
              req.services.move.update = sinon.stub().throws(error)
              await controller.saveValues(req, res, nextSpy)
            })

            it('should invoke next with error', function () {
              expect(nextSpy).to.be.calledOnceWithExactly(error)
            })
          })
        })
      }

      checkMoveTypeWithAdditionalInfo('prison_recall')
      checkMoveTypeWithAdditionalInfo('video_remand')

      context('when no additional_info field is present', function () {
        beforeEach(async function () {
          req.getMove.returns({
            move_type: 'move-type',
            additional_information: null,
          })
          await controller.saveValues(req, res, nextSpy)
        })

        it('should not call move service’s update method', function () {
          expect(moveService.update).to.not.be.called
        })
      })
    })
  })
})
