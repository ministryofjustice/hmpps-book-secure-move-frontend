const { explicitYesNo } = require('./create')

describe('explicitYesNo', function() {
  it('returns a radio component with 2 items', function() {
    const { items, component } = explicitYesNo('field1')
    expect(items.length).to.equal(2)
    expect(component).to.equal('govukRadios')
  })
})
