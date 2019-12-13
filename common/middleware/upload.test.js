const formidable = require('formidable')

const middleware = require('./upload')

const mockError = new Error('form parse failed')
const mockFieldData = { mock_field: 'field' }
const mockFileData = { file: { name: 'file.png', file_type: 'image/png' } }

describe('Upload middleware', function() {
  describe('#parseMultipartForm()', function() {
    let req, nextSpy

    beforeEach(function() {
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
        middleware.parseMultipartForm(req, {}, nextSpy)
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

          middleware.parseMultipartForm(req, {}, nextSpy)
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
        beforeEach(function() {
          sinon
            .stub(formidable.IncomingForm.prototype, 'parse')
            .callsArgWith(1, mockError, mockFieldData, mockFileData)

          middleware.parseMultipartForm(req, {}, nextSpy)
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
          expect(nextSpy.args[0][0]).to.be.an.instanceOf(Error)
          expect(nextSpy.args[0][0].message).to.equal('form parse failed')
        })
      })
    })
  })
})
