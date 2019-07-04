const presenters = require('../../../common/presenters')

const controllers = require('./')

const mockMoveDate = '2018-10-10'
const mockDownloadDate = new Date(Date.UTC(2019, 10, 10, 15, 30, 15))
const movesStub = [
  { foo: 'bar' },
  { fizz: 'buzz' },
]
const csvStub = `
"Col 1","Col 2"
"Foo","Bar"
`

describe('Moves controllers', function () {
  describe('#download()', function () {
    let req, res, nextSpy

    beforeEach(function () {
      req = {
        params: {},
        t: sinon.stub().returnsArg(0),
      }
      res = {
        send: sinon.stub(),
        json: sinon.stub(),
        setHeader: sinon.stub(),
        locals: {
          moveDate: mockMoveDate,
          movesByDate: movesStub,
        },
      }
      nextSpy = sinon.spy()
      sinon.stub(presenters, 'movesToCSV')
      this.clock = sinon.useFakeTimers(mockDownloadDate.getTime())
    })

    afterEach(function () {
      this.clock.restore()
    })

    context('when params contains no extension', function () {
      beforeEach(function () {
        controllers.download(req, res, nextSpy)
      })

      it('should not call response json or send methods', function () {
        expect(res.send).not.to.be.called
        expect(res.json).not.to.be.called
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when params contains unknown extension', function () {
      beforeEach(function () {
        req.params.extension = 'unknown'

        controllers.download(req, res, nextSpy)
      })

      it('should not call response json or send methods', function () {
        expect(res.send).not.to.be.called
        expect(res.json).not.to.be.called
      })

      it('should call next', function () {
        expect(nextSpy).to.be.calledOnceWithExactly()
      })
    })

    context('when params extension is `json`', function () {
      beforeEach(function () {
        req.params.extension = 'json'

        controllers.download(req, res, nextSpy)
      })

      it('should translate filename', function () {
        expect(req.t).to.be.calledOnceWithExactly('moves:download_filename', {
          date: mockMoveDate,
          timestamp: '2019-11-10 15:30:15',
        })
      })

      it('should set content disposition header', function () {
        expect(res.setHeader).to.be.calledOnceWithExactly('Content-disposition', 'attachment; filename=moves:download_filename.json')
      })

      it('should render moves as JSON', function () {
        expect(res.json).to.be.calledOnceWithExactly(movesStub)
      })

      it('should not call next', function () {
        expect(nextSpy).not.to.be.called
      })
    })

    context('when params extension is `csv`', function () {
      context('when movesToCSV returns successfully', function () {
        beforeEach(async function () {
          req.params.extension = 'csv'
          presenters.movesToCSV.resolves(csvStub)

          await controllers.download(req, res, nextSpy)
        })

        it('should translate filename', function () {
          expect(req.t).to.be.calledOnceWithExactly('moves:download_filename', {
            date: mockMoveDate,
            timestamp: '2019-11-10 15:30:15',
          })
        })

        it('should set content disposition header', function () {
          expect(res.setHeader.firstCall).to.be.calledWithExactly('Content-disposition', 'attachment; filename=moves:download_filename.csv')
        })

        it('should set content type', function () {
          expect(res.setHeader.secondCall).to.be.calledWithExactly('Content-Type', 'text/csv')
        })

        it('should call CSV presenter with moves stub', function () {
          expect(presenters.movesToCSV).to.be.calledOnceWithExactly(movesStub)
        })

        it('should send moves as CSV', function () {
          expect(res.send).to.be.calledOnceWithExactly(csvStub)
        })

        it('should not call next', function () {
          expect(nextSpy).not.to.be.called
        })
      })

      context('when movesToCSV errors', function () {
        const errorStub = new Error('Error stub')

        beforeEach(async function () {
          req.params.extension = 'csv'
          presenters.movesToCSV.rejects(errorStub)

          await controllers.download(req, res, nextSpy)
        })

        it('should not set content type', function () {
          expect(res.setHeader).to.be.calledOnce
        })

        it('should not call send', function () {
          expect(res.send).not.to.be.called
        })

        it('should pass error to next', function () {
          expect(nextSpy).to.be.calledOnceWithExactly(errorStub)
        })
      })
    })
  })
})
