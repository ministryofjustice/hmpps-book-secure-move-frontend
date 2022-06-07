const i18n = require('../../config/i18n').default

const presenter = require('./move-type-for-filter')

describe('move type for filter', function () {
  const testItem = {
    id: 1,
    label: 'a',
  }
  let output
  beforeEach(function () {
    sinon.stub(i18n, 't').returns('__translated__')
    output = presenter(testItem)
  })
  it('translates the label of every item', function () {
    expect(i18n.t).to.have.been.calledOnce
  })
  it('returns the items so modified', function () {
    expect(output).to.deep.equal({
      id: 1,
      label: '__translated__',
    })
  })
})
