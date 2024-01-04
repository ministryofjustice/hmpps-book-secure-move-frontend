const FormError = require('hmpo-form-wizard/lib/error')
const multer = require('multer')
const proxyquire = require('proxyquire').noCallThru()

function MulterStub() {}

MulterStub.prototype.array = sinon.stub()

function multerStub() {
  return new MulterStub()
}

multerStub.MulterError = multer.MulterError

const BaseController = require('./base')
const Controller = proxyquire('./document', {
  multer: multerStub,
})

const controller = new Controller({ route: '/' })

describe('Move controllers', function () {
  describe('Create document upload controller', function () {
    describe('#configure()', function () {
      let req, nextSpy

      beforeEach(async function () {
        sinon.spy(BaseController.prototype, 'configure')
        nextSpy = sinon.spy()
        req = {
          originalUrl: '/xhr-url',
          form: {
            options: {
              fields: {
                documents: {},
              },
            },
          },
        }

        await controller.configure(req, {}, nextSpy)
      })

      it('should set xhrUrl', function () {
        expect(req.form.options.fields.documents.xhrUrl).to.equal('/xhr-url')
      })

      it('should call parent configure method', function () {
        expect(BaseController.prototype.configure).to.be.calledOnceWithExactly(
          req,
          {},
          nextSpy
        )
      })

      it('should not throw an error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    describe('#middlewareSetup()', function () {
      beforeEach(function () {
        sinon.stub(BaseController.prototype, 'middlewareSetup')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'setNextStep')

        controller.middlewareSetup()
      })

      it('should call parent method', function () {
        expect(BaseController.prototype.middlewareSetup).to.have.been.calledOnce
      })

      it('should setup multer middleware', function () {
        expect(MulterStub.prototype.array).to.have.been.calledWith('documents')
      })

      it('should call setNextStep middleware', function () {
        expect(controller.use.getCall(1)).to.have.been.calledWith(
          controller.setNextStep
        )
      })

      it('should call correct number of middleware', function () {
        expect(controller.use.callCount).to.equal(2)
      })
    })

    describe('#setNextStep()', function () {
      let req, nextSpy

      beforeEach(function () {
        nextSpy = sinon.spy()
        req = {
          originalUrl: '/original-url',
          body: {},
          form: {
            options: {
              next: '/next-url',
            },
          },
        }
      })

      context('when request body is empty', function () {
        beforeEach(function () {
          controller.setNextStep(req, {}, nextSpy)
        })
        it('should keep original next value', function () {
          expect(req.form.options.next).to.equal('/next-url')
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when request body contains upload field', function () {
        beforeEach(function () {
          req.body = {
            upload: 'true',
          }
          controller.setNextStep(req, {}, nextSpy)
        })

        it('should keep original next value', function () {
          expect(req.form.options.next).to.equal('/original-url')
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when request body contains delete field', function () {
        beforeEach(function () {
          req.body = {
            delete: 'true',
          }
          controller.setNextStep(req, {}, nextSpy)
        })

        it('should keep original next value', function () {
          expect(req.form.options.next).to.equal('/original-url')
        })

        it('should call next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#saveValues()', function () {
      let req, res, nextSpy
      const mockDocuments = [
        { id: '12345' },
        { id: '67890' },
        { id: '112233' },
        { id: '445566' },
      ]

      beforeEach(function () {
        req = {
          sessionModel: {
            get: sinon.stub(),
          },
          form: {
            values: {},
          },
          body: {},
        }
        res = {}
        nextSpy = sinon.spy()
        sinon.stub(BaseController.prototype, 'saveValues')
      })

      context('with uploaded files', function () {
        beforeEach(async function () {
          req.files = [
            { id: 'uploaded-file-id-1' },
            { id: 'uploaded-file-id-2' },
          ]
          req.sessionModel.get.returns(mockDocuments)

          await controller.saveValues(req, res, nextSpy)
        })

        it('should delete document', function () {
          expect(req.form.values.documents).to.deep.equal([
            { id: '12345' },
            { id: '67890' },
            { id: '112233' },
            { id: '445566' },
            { id: 'uploaded-file-id-1' },
            { id: 'uploaded-file-id-2' },
          ])
        })

        it('should call parent method', function () {
          expect(
            BaseController.prototype.saveValues
          ).to.be.calledOnceWithExactly(req, res, nextSpy)
        })
      })

      context('with deleted file', function () {
        beforeEach(async function () {
          req.body.delete = '12345'
          req.sessionModel.get.returns(mockDocuments)

          await controller.saveValues(req, res, nextSpy)
        })

        it('should delete document', function () {
          expect(req.form.values.documents).to.deep.equal([
            { id: '67890' },
            { id: '112233' },
            { id: '445566' },
          ])
        })

        it('should call parent method', function () {
          expect(
            BaseController.prototype.saveValues
          ).to.be.calledOnceWithExactly(req, res, nextSpy)
        })
      })

      context('by default', function () {
        beforeEach(async function () {
          await controller.saveValues(req, res, nextSpy)
        })

        it('should set documents', function () {
          expect(req.form.values.documents).to.deep.equal([])
        })

        it('should call parent method', function () {
          expect(
            BaseController.prototype.saveValues
          ).to.be.calledOnceWithExactly(req, res, nextSpy)
        })
      })
    })

    describe('#errorHandler()', function () {
      let req, res, nextSpy

      beforeEach(function () {
        req = {
          t: sinon.stub().returnsArg(0),
        }
        res = {
          status: sinon.stub().returnsThis(),
          send: sinon.stub(),
        }
        nextSpy = sinon.spy()
        sinon.stub(BaseController.prototype, 'errorHandler')
      })

      context('with standard error', function () {
        const err = new Error('Standard error')

        beforeEach(function () {
          controller.errorHandler(err, req, res, nextSpy)
        })

        it('should not send XHR response', function () {
          expect(res.send).not.to.have.been.called
        })

        it('should call parent error handler', function () {
          expect(
            BaseController.prototype.errorHandler
          ).to.be.calledOnceWithExactly(err, req, res, nextSpy)
        })
      })

      context('with upload error', function () {
        const err = new multer.MulterError('UPLOAD_ERROR')
        err.field = 'documents'
        const uploadErr = {
          [err.field]: new FormError(err.field, { type: err.code }, req, res),
        }

        context('with normal request', function () {
          beforeEach(function () {
            controller.errorHandler(err, req, res, nextSpy)
          })

          it('should not send XHR response', function () {
            expect(res.send).not.to.have.been.called
          })

          it('should call parent error handler', function () {
            expect(
              BaseController.prototype.errorHandler
            ).to.be.calledOnceWithExactly(uploadErr, req, res, nextSpy)
          })
        })

        context('with XHR request ', function () {
          beforeEach(function () {
            req.xhr = true
            controller.errorHandler(err, req, res, nextSpy)
          })

          it('should set XHR status', function () {
            expect(res.status).to.be.calledOnceWithExactly(500)
          })

          it('should send error JSON response', function () {
            expect(res.send).to.be.calledOnceWithExactly(
              `validation::${err.code}`
            )
          })

          it('should not call parent error handler', function () {
            expect(BaseController.prototype.errorHandler).not.to.have.been
              .called
          })
        })
      })
    })

    describe('#successHandler', function () {
      let req, res, nextSpy
      const mockDocs = [{ id: 1 }, { id: 2 }]

      beforeEach(function () {
        req = {
          sessionModel: {
            get: sinon.stub(),
          },
        }
        res = {
          status: sinon.stub().returnsThis(),
          json: sinon.stub(),
        }
        nextSpy = sinon.spy()
        sinon.stub(BaseController.prototype, 'successHandler')
      })

      context('when request is not XHR', function () {
        beforeEach(function () {
          controller.successHandler(req, res, nextSpy)
        })

        it('should not send XHR response', function () {
          expect(res.json).not.to.have.been.called
        })

        it('should call parent success handler', function () {
          expect(
            BaseController.prototype.successHandler
          ).to.be.calledOnceWithExactly(req, res, nextSpy)
        })
      })

      context('when request is XHR', function () {
        beforeEach(function () {
          req.xhr = true
        })

        context('with no uploaded documents', function () {
          beforeEach(function () {
            controller.successHandler(req, res, nextSpy)
          })

          it('should set XHR status', function () {
            expect(res.status).to.be.calledOnceWithExactly(200)
          })

          it('should send empty array as JSON response', function () {
            expect(res.json).to.be.calledOnceWithExactly([])
          })

          it('should not call parent success handler', function () {
            expect(BaseController.prototype.successHandler).not.to.have.been
              .called
          })
        })

        context('with uploaded documents', function () {
          context('with one documents', function () {
            beforeEach(function () {
              req.files = mockDocs[0]
              controller.successHandler(req, res, nextSpy)
            })

            it('should set XHR status', function () {
              expect(res.status).to.be.calledOnceWithExactly(200)
            })

            it('should send documents as JSON response', function () {
              expect(res.json).to.be.calledOnceWithExactly(mockDocs[0])
            })

            it('should not call parent success handler', function () {
              expect(BaseController.prototype.successHandler).not.to.have.been
                .called
            })
          })

          context('with multiple documents', function () {
            beforeEach(function () {
              req.files = mockDocs
              controller.successHandler(req, res, nextSpy)
            })

            it('should set XHR status', function () {
              expect(res.status).to.be.calledOnceWithExactly(200)
            })

            it('should send documents as JSON response', function () {
              expect(res.json).to.be.calledOnceWithExactly(mockDocs)
            })

            it('should not call parent success handler', function () {
              expect(BaseController.prototype.successHandler).not.to.have.been
                .called
            })
          })
        })
      })
    })
  })
})
