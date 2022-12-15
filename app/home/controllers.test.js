const proxyquire = require('proxyquire')
const sinon = require('sinon')

const { DowntimeService } = require('../../common/services/contentful/downtime')
const {
  WhatsNewService,
} = require('../../common/services/contentful/whats-new')

const errorMock = new Error('500')
class DowntimeServiceMock extends DowntimeService {
  fetchBanner(entries) {
    throw errorMock
  }
}
class WhatsNewServiceMock extends WhatsNewService {
  fetchBanner(entries) {
    throw errorMock
  }
}

const controllers = proxyquire('./controllers', {
  '../../common/services/contentful/downtime': {
    DowntimeService: DowntimeServiceMock,
  },
  '../../common/services/contentful/whats-new': {
    WhatsNewService: WhatsNewServiceMock,
  },
})

describe('Home controllers', function () {
  describe('#dashboard()', function () {
    let req, res

    beforeEach(function () {
      req = {
        filterSingleRequests: ['foo', 'bar'],
        filterAllocations: ['fizz', 'buzz'],
        filterIncoming: ['fuzz', 'bang'],
        filterOutgoing: ['jon', 'doe'],
        session: {
          user: {
            permissions: [],
          },
        },
      }
      res = {
        render: sinon.spy(),
        redirect: sinon.spy(),
      }
    })

    context('with correct permission', function () {
      beforeEach(async function () {
        await controllers.dashboard(req, res)
      })

      it('should render template', function () {
        expect(res.render).to.be.calledOnce
      })

      it('should call correct template', function () {
        expect(res.render.args[0][0]).to.equal('home/dashboard')
      })

      it('should return locations sorted by title', function () {
        const params = res.render.args[0][1]
        const sections = [
          'outgoing',
          'incoming',
          'singleRequests',
          'allocations',
        ]
        expect(params).to.have.all.keys(
          'pageTitle',
          'sections',
          'currentWeek',
          'today',
          'whatsNewContent',
          'downtimeContent'
        )
        expect(params.pageTitle).to.equal('dashboard::page_title')
        expect(params.sections).to.have.all.keys(sections)
        sections.forEach(section => {
          const fields = ['permission', 'heading', 'filter', 'period']
          expect(params.sections[section]).to.have.all.keys(fields)
          expect(params.sections[section].permission).to.be.a('string')
          expect(params.sections[section].heading).to.be.a('string')
          expect(params.sections[section].filter).to.be.an('array')
          expect(params.sections[section].period).to.be.a('string')
        })
      })
      it('will return null for the whatsNewContent if an error is raised from contentful', function () {
        const params = res.render.args[0][1]
        expect(params.whatsNewContent).to.equal(null)
      })
    })
  })
})
