const controller = require('./list')

describe('the controller of the allocations outgoing list view', function() {
  let res
  let req
  beforeEach(function() {
    res = {
      render: sinon.stub(),
    }
    req = {
      t: sinon.stub().returnsArg(0),
      pagination: {
        next: '/next',
        prev: '/prev',
      },
      resultsAsTable: {
        head: [],
        rows: [],
      },
      filter: [{ value: 3 }, { value: 2 }, { value: 1 }],
    }
    controller(req, res)
  })

  it('should render a template', function() {
    expect(res.render).to.have.been.calledOnceWithExactly(
      'allocations/views/list',
      {
        pageTitle: 'allocations::dashboard.heading',
        pagination: {
          next: '/next',
          prev: '/prev',
        },
        filter: [{ value: 3 }, { value: 2 }, { value: 1 }],
        totalResults: 6,
        resultsAsTable: {
          head: [],
          rows: [],
        },
      }
    )
  })
})
