const handler = require('./confirmation')

describe('the confirmation handler', function () {
  const render = sinon.stub()
  const locals = {
    local1: 123,
  }
  beforeEach(function () {
    handler(
      {},
      {
        render,
        locals,
      }
    )
  })
  it('renders the confirmation template with the locals', function () {
    expect(render).to.have.been.calledOnceWithExactly(
      'allocation/views/confirmation',
      locals
    )
  })
})
