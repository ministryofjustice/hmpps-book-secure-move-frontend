const formidable = require('formidable')
const FormController = require('hmpo-form-wizard').Controller
const FormError = require('hmpo-form-wizard/lib/error')

const documentService = require('../../../../common/services/document')
const moveService = require('../../../../common/services/move')
const CreateDocumentController = require('./document')

const controller = new CreateDocumentController({ route: '/' })

const mockMoveId = '1234567'
const mockDocumentId = 'b3da96e8-ffbd-4b09-9de1-b09130980aaf'
const mockDocument = {
  id: mockDocumentId,
  type: 'documents',
  filename: 'Screenshot 2019-11-27 at 15.45.59.png',
  content_type: 'image/png',
}
const mockPerson = {
  id: '3333',
  fullname: 'Full name',
}
const mockMove = {
  id: mockMoveId,
  date: '2019-10-10',
  to_location: {
    title: 'To location',
  },
  person: mockPerson,
  documents: [mockDocument],
}
const mockOriginalUrl = 'new/move/upload-documents'
const mockFile = {
  id: '122334',
  attributes: {
    filename: 'robocop-jumping.png',
    type: 'img/png',
  },
  size: 100000,
}
const mockDocumentUploadResponse = {
  data: {
    id: '12345667',
    attributes: {
      filename: 'robocop-jumping.png',
    },
  },
}
const mockDocumentDeleteResponse = {
  data: {
    id: '12345667',
    attributes: {
      filename: 'robocop-jumping.png',
    },
  },
}
const mockStatusCode = 400
const errorMessage = 'something terrible has happened'
const mockError = new Error(errorMessage)
const filesizeErrorMessage = 'maxFileSize exceeded'
const mockFileSizeError = new Error(filesizeErrorMessage)
const mockFieldData = { mock_field: 'field' }
const mockFileData = { file: { name: 'file.png', file_type: 'image/png' } }

describe('Move controllers', function() {
  describe('Create document upload controller', function() {
    describe('#middlewareChecks()', function() {
      beforeEach(function() {
        sinon.stub(FormController.prototype, 'middlewareChecks')
        sinon.stub(controller, 'use')
        sinon.stub(controller, 'checkFeatureEnabled')

        controller.middlewareChecks()
      })

      it('should call parent method', function() {
        expect(FormController.prototype.middlewareChecks).to.have.been
          .calledOnce
      })

      it('should call parseMultipartForm middleware', function() {
        expect(controller.use.secondCall).to.have.been.calledWith(
          controller.parseMultipartForm
        )
      })

      it('should call checkFeatureEnabled middleware', function() {
        expect(controller.use.firstCall).to.have.been.calledWithExactly(
          controller.checkFeatureEnabled(true)
        )
      })
    })

    describe('#middlewareLocals()', function() {
      beforeEach(function() {
        sinon.stub(FormController.prototype, 'middlewareLocals')
        sinon.stub(controller, 'use')

        controller.middlewareLocals()
      })

      it('should call parent method', function() {
        expect(FormController.prototype.middlewareLocals).to.have.been
          .calledOnce
      })

      it('should call set cancel url method', function() {
        expect(controller.use).to.have.been.calledWith(
          controller.populateDocumentUpload
        )
      })
    })

    describe('#checkFeatureEnabled()', function() {
      let req, nextSpy

      beforeEach(function() {
        req = {
          form: {
            options: {},
          },
        }
        nextSpy = sinon.spy()
      })

      context('when feature is enabled', function() {
        beforeEach(function() {
          controller.checkFeatureEnabled(true)(req, {}, nextSpy)
        })

        it('should not set skip option', function() {
          expect(req.form.options.skip).to.be.undefined
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })

      context('when feature is not enabled', function() {
        beforeEach(function() {
          controller.checkFeatureEnabled(false)(req, {}, nextSpy)
        })

        it('should set skip option', function() {
          expect(req.form.options.skip).to.equal(true)
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#xhrErrorResponse()', function() {
      let response, t

      beforeEach(function() {
        t = sinon.stub().returns('__translated__')
      })

      afterEach(function() {
        t.reset()
      })

      context('without error type argument', function() {
        beforeEach(function() {
          response = controller.xhrErrorResponse(t, 'generic')
        })

        it('should call parent method', function() {
          expect(response).to.deep.equal({
            href: '#document_upload',
            text: '__translated__ __translated__',
          })
        })

        it('should translate document upload label', function() {
          expect(t.firstCall).to.be.calledWith('fields::document_upload.label')
        })

        it('should translate validation generic error', function() {
          expect(t.secondCall).to.be.calledWith('validation::generic')
        })
      })

      context('with error type argument', function() {
        const errorType = 'filesize'

        beforeEach(function() {
          response = controller.xhrErrorResponse(t, errorType)
        })

        it('should call parent method', function() {
          expect(response).to.deep.equal({
            href: '#document_upload',
            text: '__translated__ __translated__',
          })
        })

        it('should translate document upload label', function() {
          expect(t.firstCall).to.be.calledWith('fields::document_upload.label')
        })

        it('should translate validation filesize error', function() {
          expect(t.secondCall).to.be.calledWith(`validation::${errorType}`)
        })
      })
    })

    describe('#parseMultipartForm()', function() {
      let req, res, nextSpy

      beforeEach(function() {
        res = {
          status: sinon.stub().returnsThis(),
          json: sinon.spy(),
        }
        nextSpy = sinon.spy()
      })

      context('when request is not a multipart/form-data POST', function() {
        beforeEach(function() {
          req = {
            method: 'get',
            get: sinon
              .stub()
              .withArgs('content-type')
              .returns('application/json'),
          }

          sinon.spy(formidable, 'IncomingForm')
          controller.parseMultipartForm(req, res, nextSpy)
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnce
          expect(nextSpy).to.be.calledWithExactly()
        })

        it('should not call IncomingForm', function() {
          expect(formidable.IncomingForm).to.not.be.called
        })
      })

      context('when request is a multipart/form-data POST', function() {
        beforeEach(function() {
          req = {
            body: {},
            headers: {
              'content-type': 'multipart/form-data',
            },
            on: sinon.stub().returnsThis(),
            method: 'post',
            get: sinon
              .stub()
              .withArgs('content-type')
              .returns('multipart/form-data'),
          }

          sinon.spy(formidable, 'IncomingForm')
        })

        context('when form parse is successful', function() {
          beforeEach(function() {
            sinon
              .stub(formidable.IncomingForm.prototype, 'parse')
              .callsArgWith(1, null, mockFieldData, mockFileData)

            controller.parseMultipartForm(req, {}, nextSpy)
          })

          it('should call IncomingForm', function() {
            expect(formidable.IncomingForm).to.be.calledOnce
            expect(formidable.IncomingForm).to.be.calledWithExactly()
          })

          it('should call IncomingForm.parse', function() {
            expect(formidable.IncomingForm.prototype.parse).to.be.calledOnce
          })

          it('should correctly add form data to req.body', function() {
            expect(req.body).to.deep.equal({
              files: [
                {
                  name: 'file.png',
                  file_type: 'image/png',
                },
              ],
              mock_field: 'field',
            })
          })

          it('should call next', function() {
            expect(nextSpy).to.be.calledOnce
            expect(nextSpy).to.be.calledWithExactly()
          })
        })

        context('when form parse fails', function() {
          context('when an xhr request', function() {
            beforeEach(function() {
              req.t = sinon.stub()
              req.xhr = true

              req.t.returns('__translated__')
            })

            context('with a generic error', function() {
              beforeEach(function() {
                sinon
                  .stub(formidable.IncomingForm.prototype, 'parse')
                  .callsArgWith(1, mockError, mockFieldData, mockFileData)

                controller.parseMultipartForm(req, res, nextSpy)
              })

              it('should call IncomingForm', function() {
                expect(formidable.IncomingForm).to.be.calledOnce
                expect(formidable.IncomingForm).to.be.calledWithExactly()
              })

              it('should call IncomingForm.parse', function() {
                expect(formidable.IncomingForm.prototype.parse).to.be.calledOnce
              })

              it('should not add form data to req.body', function() {
                expect(req.body).to.deep.equal({})
              })

              it('should call res with the correct status', function() {
                expect(res.status).to.have.been.calledOnce
                expect(res.status).to.have.been.calledWithExactly(500)
              })

              it('should translate document upload label', function() {
                expect(req.t.firstCall).to.be.calledWith(
                  'fields::document_upload.label'
                )
              })

              it('should translate validation server error', function() {
                expect(req.t.secondCall).to.be.calledWith('validation::generic')
              })

              it('should return expected json', function() {
                expect(res.json).to.have.been.calledOnce
                expect(res.json).to.have.been.calledWithExactly([
                  {
                    href: '#document_upload',
                    text: '__translated__ __translated__',
                  },
                ])
              })
            })

            context('with a filesize error', function() {
              beforeEach(function() {
                sinon
                  .stub(formidable.IncomingForm.prototype, 'parse')
                  .callsArgWith(
                    1,
                    mockFileSizeError,
                    mockFieldData,
                    mockFileData
                  )

                controller.parseMultipartForm(req, res, nextSpy)
              })

              it('should call IncomingForm', function() {
                expect(formidable.IncomingForm).to.be.calledOnce
                expect(formidable.IncomingForm).to.be.calledWithExactly()
              })

              it('should call IncomingForm.parse', function() {
                expect(formidable.IncomingForm.prototype.parse).to.be.calledOnce
              })

              it('should not add form data to req.body', function() {
                expect(req.body).to.deep.equal({})
              })

              it('should call res with the correct status', function() {
                expect(res.status).to.have.been.calledOnce
                expect(res.status).to.have.been.calledWithExactly(500)
              })

              it('should translate document upload label', function() {
                expect(req.t.firstCall).to.be.calledWith(
                  'fields::document_upload.label'
                )
              })

              it('should translate validation server error', function() {
                expect(req.t.secondCall).to.be.calledWith(
                  'validation::filesize'
                )
              })

              it('should return expected json', function() {
                expect(res.json).to.have.been.calledOnce
                expect(res.json).to.have.been.calledWithExactly([
                  {
                    href: '#document_upload',
                    text: '__translated__ __translated__',
                  },
                ])
              })
            })
          })

          context('when not an xhr request', function() {
            beforeEach(function() {
              req.xhr = false
            })

            context('with a generic error', function() {
              beforeEach(function() {
                sinon
                  .stub(formidable.IncomingForm.prototype, 'parse')
                  .callsArgWith(1, mockError, mockFieldData, mockFileData)

                controller.parseMultipartForm(req, res, nextSpy)
              })

              it('should call IncomingForm', function() {
                expect(formidable.IncomingForm).to.be.calledOnce
                expect(formidable.IncomingForm).to.be.calledWithExactly()
              })

              it('should call IncomingForm.parse', function() {
                expect(formidable.IncomingForm.prototype.parse).to.be.calledOnce
              })

              it('should not add form data to req.body', function() {
                expect(req.body).to.deep.equal({})
              })

              it('should call next with error', function() {
                expect(nextSpy).to.be.calledOnce
                expect(nextSpy.args[0][0].document_upload).to.be.an.instanceOf(
                  FormError
                )
                expect(nextSpy.args[0][0].document_upload.errorGroup).to.equal(
                  'document_upload'
                )
                expect(nextSpy.args[0][0].document_upload.key).to.equal(
                  'document_upload'
                )
                expect(nextSpy.args[0][0].document_upload.type).to.equal(
                  'generic'
                )
              })
            })

            context('with a filesize error', function() {
              beforeEach(function() {
                sinon
                  .stub(formidable.IncomingForm.prototype, 'parse')
                  .callsArgWith(
                    1,
                    mockFileSizeError,
                    mockFieldData,
                    mockFileData
                  )

                controller.parseMultipartForm(req, res, nextSpy)
              })

              it('should call IncomingForm', function() {
                expect(formidable.IncomingForm).to.be.calledOnce
                expect(formidable.IncomingForm).to.be.calledWithExactly()
              })

              it('should call IncomingForm.parse', function() {
                expect(formidable.IncomingForm.prototype.parse).to.be.calledOnce
              })

              it('should not add form data to req.body', function() {
                expect(req.body).to.deep.equal({})
              })

              it('should call next with error', function() {
                expect(nextSpy).to.be.calledOnce
                expect(nextSpy.args[0][0].document_upload).to.be.an.instanceOf(
                  FormError
                )
                expect(nextSpy.args[0][0].document_upload.errorGroup).to.equal(
                  'document_upload'
                )
                expect(nextSpy.args[0][0].document_upload.key).to.equal(
                  'document_upload'
                )
                expect(nextSpy.args[0][0].document_upload.type).to.equal(
                  'filesize'
                )
              })
            })
          })
        })
      })
    })

    describe('#populateDocumentUpload()', function() {
      let res, req, nextSpy

      beforeEach(function() {
        nextSpy = sinon.spy()
        req = {
          body: {},
          sessionModel: {
            get: sinon.stub(),
          },
          form: {
            options: {
              fields: {
                document_upload: {},
              },
            },
          },
          originalUrl: mockOriginalUrl,
        }
        res = {
          locals: {},
        }
      })

      context('with move in the session', function() {
        beforeEach(function() {
          req.sessionModel.get.withArgs('move').returns({ id: mockMoveId })
        })

        context('with a successful upload', function() {
          beforeEach(async function() {
            sinon.stub(moveService, 'getById').resolves(mockMove)

            controller.populateDocumentUpload(req, res, nextSpy)
          })

          it('should call moveService getById', function() {
            expect(moveService.getById).to.have.been.calledWithExactly(
              mockMoveId
            )
          })

          it('should set documents on document_upload field', function() {
            expect(
              req.form.options.fields.document_upload.documents
            ).to.deep.equal(mockMove.documents)
          })

          it('should set xhrUrl on document_upload field', function() {
            expect(req.form.options.fields.document_upload.xhrUrl).to.equal(
              mockOriginalUrl
            )
          })

          it('should call next', function() {
            expect(nextSpy).to.be.calledOnceWithExactly()
          })
        })

        context('with a failed upload', function() {
          beforeEach(async function() {
            sinon.stub(moveService, 'getById').rejects(mockError)

            controller.populateDocumentUpload(req, res, nextSpy)
          })

          it('should call moveService getById', function() {
            expect(moveService.getById).to.have.been.calledWithExactly(
              mockMoveId
            )
          })

          it('should not set documents on document_upload field', function() {
            expect(
              req.form.options.fields.document_upload.documents
            ).to.be.undefined
          })

          it('should not set xhrUrl on document_upload field', function() {
            expect(
              req.form.options.fields.document_upload.xhrUrl
            ).to.be.undefined
          })

          it('should call next with error', function() {
            expect(nextSpy).to.be.calledOnce
            expect(nextSpy.args[0][0]).to.be.an.instanceOf(Error)
            expect(nextSpy.args[0][0].message).to.equal(errorMessage)
          })
        })
      })

      context('without move in the session', function() {
        beforeEach(async function() {
          req.sessionModel.get.withArgs('move').returns()
          sinon.spy(moveService, 'getById')

          controller.populateDocumentUpload(req, res, nextSpy)
        })

        it('should not call moveService getById', function() {
          expect(moveService.getById).to.not.have.been.called
        })

        it('should not set documents on document_upload field', function() {
          expect(
            req.form.options.fields.document_upload.documents
          ).to.be.undefined
        })

        it('should set xhrUrl on document_upload field', function() {
          expect(req.form.options.fields.document_upload.xhrUrl).to.equal(
            mockOriginalUrl
          )
        })

        it('should call next', function() {
          expect(nextSpy).to.be.calledOnceWithExactly()
        })
      })
    })

    describe('#post()', function() {
      let res, req, nextSpy

      beforeEach(function() {
        nextSpy = sinon.spy()
        req = {
          body: {},
          t: sinon.stub(),
        }
        res = {
          locals: {
            move: mockMove,
          },
          status: sinon.stub().returnsThis(),
          json: sinon.spy(),
        }
      })

      context('with xhr', function() {
        beforeEach(function() {
          req.xhr = true

          sinon.stub(FormController.prototype, 'post')
        })

        context('with files', function() {
          context('when document upload is successful', function() {
            beforeEach(async function() {
              req.body.files = [mockFile]

              sinon
                .stub(controller, 'processDocumentUpload')
                .resolves(mockDocumentUploadResponse)

              await controller.post(req, res, nextSpy)
            })

            it('should call processDocumentUpload', function() {
              expect(controller.processDocumentUpload).to.have.been.calledOnce
              expect(
                controller.processDocumentUpload
              ).to.have.been.calledWithExactly(req, res)
            })

            it('should call res with the correct status', function() {
              expect(res.status).to.have.been.calledOnce
              expect(res.status).to.have.been.calledWithExactly(200)
            })

            it('should return expected json', function() {
              expect(res.json).to.have.been.calledOnce
              expect(res.json).to.have.been.calledWithExactly(
                mockDocumentUploadResponse
              )
            })

            it('should not call parent post method', function() {
              expect(FormController.prototype.post).to.not.have.been.called
            })
          })
        })

        context('when document upload fails', function() {
          beforeEach(function() {
            req.body.files = [mockFile]
            req.t.returns('__translated__')
          })

          context('with error response code from API', function() {
            beforeEach(async function() {
              sinon.stub(controller, 'processDocumentUpload').rejects({
                response: { status: mockStatusCode },
              })

              await controller.post(req, res, nextSpy)
            })

            it('should call processDocumentUpload', function() {
              expect(controller.processDocumentUpload).to.have.been.calledOnce
              expect(
                controller.processDocumentUpload
              ).to.have.been.calledWithExactly(req, res)
            })

            it('should call res with the correct status', function() {
              expect(res.status).to.have.been.calledOnce
              expect(res.status).to.have.been.calledWithExactly(mockStatusCode)
            })

            it('should return expected json', function() {
              expect(res.json).to.have.been.calledOnce
              expect(res.json).to.have.been.calledWithExactly([
                {
                  href: '#document_upload',
                  text: '__translated__ __translated__',
                },
              ])
            })

            it('should translate document upload label', function() {
              expect(req.t.firstCall).to.be.calledWith(
                'fields::document_upload.label'
              )
            })

            it('should translate validation server error', function() {
              expect(req.t.secondCall).to.be.calledWith('validation::generic')
            })

            it('should not call parent post method', function() {
              expect(FormController.prototype.post).to.not.have.been.called
            })
          })

          context('without error response code from API', function() {
            beforeEach(async function() {
              sinon.stub(controller, 'processDocumentUpload').rejects()

              await controller.post(req, res, nextSpy)
            })

            it('should call processDocumentUpload', function() {
              expect(controller.processDocumentUpload).to.have.been.calledOnce
              expect(
                controller.processDocumentUpload
              ).to.have.been.calledWithExactly(req, res)
            })

            it('should call res with the correct status', function() {
              expect(res.status).to.have.been.calledOnce
              expect(res.status).to.have.been.calledWithExactly(500)
            })

            it('should return expected json', function() {
              expect(res.json).to.have.been.calledOnce
              expect(res.json).to.have.been.calledWithExactly([
                {
                  href: '#document_upload',
                  text: '__translated__ __translated__',
                },
              ])
            })

            it('should translate document upload label', function() {
              expect(req.t.firstCall).to.be.calledWith(
                'fields::document_upload.label'
              )
            })

            it('should translate validation server error', function() {
              expect(req.t.secondCall).to.be.calledWith('validation::generic')
            })

            it('should not call parent post method', function() {
              expect(FormController.prototype.post).to.not.have.been.called
            })
          })
        })
      })

      context('without xhr', function() {
        beforeEach(function() {
          req.xhr = false

          sinon.stub(FormController.prototype, 'post')
        })

        context('with files', function() {
          context('when document upload is successful', function() {
            beforeEach(async function() {
              req.body.files = [mockFile]

              sinon.stub(controller, 'processDocumentUpload').resolves()

              await controller.post(req, res, nextSpy)
            })

            it('should call processDocumentUpload', function() {
              expect(controller.processDocumentUpload).to.have.been.calledOnce
              expect(
                controller.processDocumentUpload
              ).to.have.been.calledWithExactly(req, res)
            })

            it('should call parent post method', function() {
              expect(FormController.prototype.post).to.have.been.calledOnce
              expect(
                FormController.prototype.post
              ).to.have.been.calledWithExactly(req, res, nextSpy)
            })
          })

          context('when document upload fails', function() {
            beforeEach(async function() {
              req.body.files = [mockFile]
              sinon.stub(controller, 'processDocumentUpload').rejects()

              await controller.post(req, res, nextSpy)
            })

            it('should call processDocumentUpload', function() {
              expect(controller.processDocumentUpload).to.have.been.calledOnce
              expect(
                controller.processDocumentUpload
              ).to.have.been.calledWithExactly(req, res)
            })

            it('should call next with error', function() {
              expect(nextSpy).to.be.calledWithExactly({
                document_upload: controller.serverError(
                  req,
                  res,
                  'document_upload'
                ),
              })
            })

            it('should not call parent post method', function() {
              expect(FormController.prototype.post).to.not.have.been.called
            })
          })
        })

        context('with documentId', function() {
          context('when document delete is successful', function() {
            beforeEach(async function() {
              req.body.document_id = mockDocumentId
              sinon.stub(documentService, 'delete').resolves()

              await controller.post(req, res, nextSpy)
            })

            it('should call documentService delete', function() {
              expect(documentService.delete).to.have.been.calledOnce
              expect(documentService.delete).to.have.been.calledWithExactly(
                mockMoveId,
                mockDocumentId
              )
            })

            it('should call parent post method', function() {
              expect(FormController.prototype.post).to.have.been.calledOnce
              expect(
                FormController.prototype.post
              ).to.have.been.calledWithExactly(req, res, nextSpy)
            })
          })
          context('when document delete fails', function() {
            beforeEach(async function() {
              req.body.document_id = mockDocumentId
              sinon.stub(documentService, 'delete').rejects()

              await controller.post(req, res, nextSpy)
            })

            it('should call documentService delete', function() {
              expect(documentService.delete).to.have.been.calledOnce
              expect(documentService.delete).to.have.been.calledWithExactly(
                mockMoveId,
                mockDocumentId
              )
            })

            it('should call next with error', function() {
              expect(nextSpy).to.be.calledWithExactly({
                document_upload: controller.serverError(
                  req,
                  res,
                  'document_upload'
                ),
              })
            })

            it('should not call parent post method', function() {
              expect(FormController.prototype.post).to.not.have.been.called
            })
          })
        })
      })
    })

    describe('#processDocumentUpload()', function() {
      let res, req, response

      beforeEach(function() {
        req = {
          body: {
            files: [],
          },
        }
        res = {
          locals: {
            move: mockMove,
          },
        }

        sinon.stub(documentService, 'upload').resolves('file uploaded')
      })

      context('with files', function() {
        beforeEach(async function() {
          req.body.files.push(mockFile)

          response = await controller.processDocumentUpload(req, res)
        })

        it('should call documentService upload', function() {
          expect(documentService.upload).to.have.been.calledOnce
          expect(documentService.upload).to.have.been.calledWithExactly(
            mockFile,
            mockMoveId
          )
        })

        it('should call documentService upload', function() {
          expect(response).to.deep.equal(['file uploaded'])
        })
      })

      context('without files', function() {
        beforeEach(async function() {
          req.body.files = []

          response = await controller.processDocumentUpload(req, res)
        })

        it('should call documentService upload', function() {
          expect(documentService.upload).to.not.be.called
        })

        it('should not call documentService upload', function() {
          expect(response).to.deep.equal([])
        })
      })
    })

    describe('#delete()', function() {
      let res, req, nextSpy

      beforeEach(function() {
        nextSpy = sinon.spy()
        req = {
          query: {},
          body: {},
          t: sinon.stub(),
        }
        res = {
          locals: {
            move: mockMove,
          },
          status: sinon.stub().returnsThis(),
          json: sinon.spy(),
        }
      })

      context('without documentId', function() {
        beforeEach(async function() {
          await controller.delete(req, res, nextSpy)
        })

        it('should call next with error', function() {
          expect(nextSpy).to.be.calledOnce
          expect(nextSpy.args[0][0]).to.be.an.instanceOf(Error)
          expect(nextSpy.args[0][0].message).to.equal('No document Id supplied')
        })
      })

      context('with documentId', function() {
        beforeEach(function() {
          req.query.document_id = mockDocumentId
        })
        context('when document delete is successful', function() {
          beforeEach(async function() {
            sinon
              .stub(documentService, 'delete')
              .resolves(mockDocumentDeleteResponse)

            await controller.delete(req, res, nextSpy)
          })

          it('should call documentService delete', function() {
            expect(documentService.delete).to.have.been.calledOnce
            expect(documentService.delete).to.have.been.calledWithExactly(
              mockMoveId,
              mockDocumentId
            )
          })

          it('should call res with the correct status', function() {
            expect(res.status).to.have.been.calledOnce
            expect(res.status).to.have.been.calledWithExactly(200)
          })

          it('should return expected json', function() {
            expect(res.json).to.have.been.calledOnce
            expect(res.json).to.have.been.calledWithExactly(
              mockDocumentDeleteResponse
            )
          })
        })

        context('when document delete fails', function() {
          beforeEach(function() {
            req.t.returns('__translated__')
          })

          context('with error response code from API', function() {
            beforeEach(async function() {
              sinon.stub(documentService, 'delete').rejects({
                response: { status: mockStatusCode },
              })

              await controller.delete(req, res, nextSpy)
            })

            it('should call documentService delete', function() {
              expect(documentService.delete).to.have.been.calledOnce
              expect(documentService.delete).to.have.been.calledWithExactly(
                mockMoveId,
                mockDocumentId
              )
            })

            it('should call res with the correct status', function() {
              expect(res.status).to.have.been.calledOnce
              expect(res.status).to.have.been.calledWithExactly(mockStatusCode)
            })

            it('should return expected json', function() {
              expect(res.json).to.have.been.calledOnce
              expect(res.json).to.have.been.calledWithExactly([
                {
                  href: '#document_upload',
                  text: '__translated__ __translated__',
                },
              ])
            })

            it('should translate document upload label', function() {
              expect(req.t.firstCall).to.be.calledWith(
                'fields::document_upload.label'
              )
            })

            it('should translate validation server error', function() {
              expect(req.t.secondCall).to.be.calledWith('validation::generic')
            })
          })

          context('without error response code from API', function() {
            beforeEach(async function() {
              sinon.stub(documentService, 'delete').rejects()

              await controller.delete(req, res, nextSpy)
            })

            it('should call documentService delete', function() {
              expect(documentService.delete).to.have.been.calledOnce
              expect(documentService.delete).to.have.been.calledWithExactly(
                mockMoveId,
                mockDocumentId
              )
            })

            it('should call res with the correct status', function() {
              expect(res.status).to.have.been.calledOnce
              expect(res.status).to.have.been.calledWithExactly(500)
            })

            it('should return expected json', function() {
              expect(res.json).to.have.been.calledOnce
              expect(res.json).to.have.been.calledWithExactly([
                {
                  href: '#document_upload',
                  text: '__translated__ __translated__',
                },
              ])
            })

            it('should translate document upload label', function() {
              expect(req.t.firstCall).to.be.calledWith(
                'fields::document_upload.label'
              )
            })

            it('should translate validation server error', function() {
              expect(req.t.secondCall).to.be.calledWith('validation::generic')
            })
          })
        })
      })
    })

    describe('#successHandler()', function() {
      let res, req, nextSpy

      beforeEach(function() {
        nextSpy = sinon.spy()
        req = {
          body: {},
          originalUrl: mockOriginalUrl,
        }
        res = {
          redirect: sinon.spy(),
        }
      })

      context('without documentId or upload', function() {
        beforeEach(function() {
          sinon.stub(FormController.prototype, 'successHandler')

          controller.successHandler(req, res, nextSpy)
        })

        it('should call parent successHandler method', function() {
          expect(
            FormController.prototype.successHandler
          ).to.have.been.calledOnce
          expect(
            FormController.prototype.successHandler
          ).to.have.been.calledWithExactly(req, res, nextSpy)
        })

        it('should not call redirect', function() {
          expect(res.redirect).to.not.have.been.called
        })
      })

      context('with documentId', function() {
        beforeEach(function() {
          req.body.document_id = mockDocumentId
          sinon.stub(FormController.prototype, 'successHandler')

          controller.successHandler(req, res, nextSpy)
        })

        it('should call redirect', function() {
          expect(res.redirect).to.have.been.calledOnce
          expect(res.redirect).to.have.been.calledWithExactly(req.originalUrl)
        })

        it('should not call parent successHandler method', function() {
          expect(
            FormController.prototype.successHandler
          ).to.not.have.been.called
        })
      })

      context('with upload', function() {
        beforeEach(function() {
          req.body.upload = 'upload'
          sinon.stub(FormController.prototype, 'successHandler')

          controller.successHandler(req, res, nextSpy)
        })

        it('should call redirect', function() {
          expect(res.redirect).to.have.been.calledOnce
          expect(res.redirect).to.have.been.calledWithExactly(req.originalUrl)
        })

        it('should not call parent successHandler method', function() {
          expect(
            FormController.prototype.successHandler
          ).to.not.have.been.called
        })
      })
    })

    describe('#serverError()', function() {
      let res, req, serverError

      beforeEach(function() {
        req = {
          query: {},
          body: {},
        }
        res = {
          locals: {
            move: mockMove,
          },
        }
      })

      context('default call', function() {
        const mockFieldName = 'document_upload'

        beforeEach(function() {
          serverError = controller.serverError(req, res, mockFieldName)
        })

        it('should return expected error', function() {
          expect(serverError).to.be.an.instanceOf(FormError)
          expect(serverError).to.deep.equal({
            args: {
              generic: undefined,
            },
            errorGroup: 'document_upload',
            headerMessage: undefined,
            key: 'document_upload',
            message: undefined,
            redirect: undefined,
            type: 'generic',
            url: undefined,
          })
        })
      })
    })
  })
})
