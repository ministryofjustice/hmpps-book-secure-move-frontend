const middleware = require('./set-breadcrumbs')

describe('Framework middleware', function () {
  describe('#setBreadcrumbs', function () {
    let mockReq, mockRes, nextSpy

    beforeEach(function () {
      nextSpy = sinon.spy()
      mockReq = {
        t: sinon.stub().returnsArg(0),
      }
      mockRes = {
        breadcrumb: sinon.stub().returnsThis(),
      }
    })

    context('when move exists on request', function () {
      beforeEach(function () {
        mockReq.assessment = {
          id: '__assessment_12345__',
          framework: {
            name: 'assessment-name',
          },
        }
        mockReq.move = {
          id: '__move_12345__',
          reference: 'PFX7536F',
          profile: {
            person: {
              _fullname: 'DOE, JOHN',
            },
          },
        }
        middleware(mockReq, mockRes, nextSpy)
      })

      it('should set move breadcrumb item', function () {
        expect(mockRes.breadcrumb).to.have.been.calledWithExactly({
          text: 'DOE, JOHN (PFX7536F)',
          href: '/move/__move_12345__',
        })
      })

      it('should set assessment breadcrumb item', function () {
        expect(mockRes.breadcrumb).to.have.been.calledWithExactly({
          text: 'assessment::page_title',
          href: '/move/__move_12345__/assessment-name',
        })
      })

      it('should translate correctly', function () {
        expect(mockReq.t).to.have.been.calledWithExactly(
          'assessment::page_title',
          {
            context: 'assessment_name',
          }
        )
      })

      it('should call next without error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when no move exists on request', function () {
      beforeEach(function () {
        mockReq.assessment = {
          id: '__assessment_12345__',
          framework: {
            name: 'assessment-name',
          },
          profile: {
            person: {
              _fullname: 'DOE, JOHN',
            },
          },
          move: {
            id: '__move_12345__',
            reference: 'PFX7536F',
          },
        }
        middleware(mockReq, mockRes, nextSpy)
      })

      it('should set move breadcrumb item', function () {
        expect(mockRes.breadcrumb).to.have.been.calledWithExactly({
          text: 'DOE, JOHN (PFX7536F)',
          href: '/move/__move_12345__',
        })
      })

      it('should set assessment breadcrumb item', function () {
        expect(mockRes.breadcrumb).to.have.been.calledWithExactly({
          text: 'assessment::page_title',
          href: '/assessment-name/__assessment_12345__',
        })
      })

      it('should translate correctly', function () {
        expect(mockReq.t).to.have.been.calledWithExactly(
          'assessment::page_title',
          {
            context: 'assessment_name',
          }
        )
      })

      it('should call next without error', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })
  })
})
