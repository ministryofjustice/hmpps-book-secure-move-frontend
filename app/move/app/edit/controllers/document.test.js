const CreateDocument = require('../../new/controllers/document')

const UpdateBaseController = require('./base')
const DocumentController = require('./document')

const MixinProto = CreateDocument.prototype

const controller = new DocumentController({ route: '/' })
const ownProto = Object.getPrototypeOf(controller)

describe('Move controllers', function () {
  describe('Update documents controller', function () {
    it('should extend UpdateBaseController', function () {
      expect(Object.getPrototypeOf(ownProto)).to.equal(
        UpdateBaseController.prototype
      )
    })

    describe('When mixing in create controller', function () {
      it('should copy middlewareSetup from CreateDocument', function () {
        expect(controller.middlewareSetup).to.exist.and.equal(
          MixinProto.middlewareSetup
        )
      })

      it('should copy setNextStep from CreateDocument', function () {
        expect(controller.setNextStep).to.exist.and.equal(
          MixinProto.setNextStep
        )
      })

      it('should copy saveValues from CreateDocument', function () {
        expect(controller.saveValues).to.exist.and.equal(MixinProto.saveValues)
      })

      it('should copy errorHandler from CreateDocument', function () {
        expect(controller.errorHandler).to.exist.and.equal(
          MixinProto.errorHandler
        )
      })

      it('should only have the expected methods of its own', function () {
        const ownMethods = ['configure', 'getUpdateValues', 'successHandler']
        const mixedinMethods = Object.getOwnPropertyNames(MixinProto)
        const ownProps = Object.getOwnPropertyNames(ownProto).filter(
          prop => !mixedinMethods.includes(prop) || ownMethods.includes(prop)
        )
        expect(ownProps).to.deep.equal(ownMethods)
      })
    })

    describe('#configure', function () {
      const req = {
        session: {
          currentLocation: {},
        },
      }
      const res = {}
      let nextSpy
      beforeEach(function () {
        sinon.stub(MixinProto, 'configure')
        nextSpy = sinon.spy()
      })

      context('When current location does allow uploads', function () {
        beforeEach(function () {
          req.session.currentLocation.can_upload_documents = true
          controller.configure(req, res, nextSpy)
        })

        it('should not call next', function () {
          expect(nextSpy).not.to.be.called
        })

        it('should invoke mixin’s configure', function () {
          expect(MixinProto.configure).to.be.calledOnceWithExactly(
            req,
            res,
            nextSpy
          )
        })
      })

      context('When current location does not allow uploads', function () {
        let args
        let error
        beforeEach(function () {
          args = []
          error = {}
          req.session.currentLocation.can_upload_documents = false
          controller.configure(req, res, nextSpy)

          try {
            args = nextSpy.getCall(0).args
            error = args[0]
          } catch (e) {}
        })

        it('should not invoke mixin’s configure', function () {
          expect(MixinProto.configure).not.to.be.called
        })

        it('should call next once with an error', function () {
          expect(nextSpy).to.be.calledOnce
          expect(args.length).to.equal(1)
        })

        it('should set the correct error message', function () {
          expect(error.message).to.equal(
            'Document upload is not possible for this location'
          )
        })

        it('should set the correct error statusCode', function () {
          expect(error.statusCode).to.equal(404)
        })
      })
    })

    describe('#getUpdateValues', function () {
      let req = {}
      const res = {}
      const documents = [{ id: 'foo' }, { id: 'bar' }]
      beforeEach(function () {
        req = {
          getMove: sinon.stub(),
          sessionModel: {
            set: sinon.stub(),
            get: sinon.stub().returns(documents),
          },
        }
      })

      context('When no move exists', function () {
        it('should return an empty object', function () {
          expect(controller.getUpdateValues(req, res)).to.deep.equal({})
        })
      })

      context('When a move exists', function () {
        const move = { id: '#move', profile: { id: '#profile', documents } }
        let values
        beforeEach(function () {
          req.getMove.returns(move)
        })
        context('When not inital step', function () {
          beforeEach(function () {
            values = controller.getUpdateValues(req, res)
          })

          it('should not copy the documents from the move to the session', function () {
            expect(req.sessionModel.set).not.to.be.called
          })

          it('should get the move’s documents correctly', function () {
            expect(req.sessionModel.get).to.be.calledOnceWithExactly(
              'documents'
            )
          })

          it('should return the move’s documents', function () {
            expect(values.documents).to.equal(documents)
          })
        })

        context('When inital step', function () {
          beforeEach(function () {
            req.initialStep = true
            controller.getUpdateValues(req, res)
          })

          it('should copy the documents from the move to the session', function () {
            expect(req.sessionModel.set).to.be.calledOnceWithExactly(
              'documents',
              documents
            )
          })
        })
      })
    })

    describe('#successHandler', function () {
      let req = {}
      let res = {}
      let nextSpy, profileService
      const documents = [{ id: 'foo' }, { id: 'bar' }]
      const profile = { id: '#profile', person: { id: '#person' } }
      const mockProfile = { ...profile, foo: 'bar' }

      beforeEach(function () {
        profileService = {
          update: sinon.stub().resolves({}),
        }
        req = {
          getMove: sinon.stub().returns({ profile: mockProfile }),
          form: {
            values: {
              documents,
            },
          },
          services: {
            profile: profileService,
          },
        }
        res = {
          redirect: sinon.stub(),
        }
        sinon.stub(controller, 'getBaseUrl').returns('__url__')
        sinon.stub(MixinProto, 'successHandler')
        nextSpy = sinon.spy()
      })

      context('When saving changed documents', function () {
        beforeEach(async function () {
          await controller.successHandler(req, res, nextSpy)
        })

        it('should update the move', function () {
          expect(profileService.update).to.be.calledOnceWithExactly({
            ...profile,
            documents,
          })
        })

        it('should redirect back to the move view', function () {
          expect(controller.getBaseUrl).to.be.calledOnceWithExactly(req)
          expect(res.redirect).to.be.calledOnceWithExactly('__url__')
        })

        it('should not invoke mixin’s successHandler', function () {
          expect(MixinProto.successHandler).not.to.be.called
        })

        it('should not invoke next', function () {
          expect(nextSpy).not.to.be.called
        })
      })

      context('When saving fails', function () {
        const error = new Error('boom')

        beforeEach(async function () {
          profileService.update.throws(error)
          await controller.successHandler(req, res, nextSpy)
        })

        it('should invoke next with error', function () {
          expect(nextSpy).to.be.calledOnceWithExactly(error)
        })
      })

      context('When it’s an XHR request', function () {
        beforeEach(async function () {
          req.xhr = true
          await controller.successHandler(req, res, nextSpy)
        })

        it('should not update the move', function () {
          expect(profileService.update).not.to.be.called
        })

        it('should invoke mixin’s successHandler', function () {
          expect(MixinProto.successHandler).to.be.calledOnceWithExactly(
            req,
            res,
            nextSpy
          )
        })

        it('should not invoke next', function () {
          expect(nextSpy).not.to.be.called
        })
      })
    })
  })
})
