const { explicitAssessmentQuestion } = require('./create')

describe('explicitAssessmentQuestion', function() {
  it('returns a radio component with 2 items', function() {
    const { items, component } = explicitAssessmentQuestion('field1')
    expect(items.length).to.equal(2)
    expect(component).to.equal('govukRadios')
  })
})
