const moveNotAgreedInstruction = {
  skip: true,
  component: 'raw',
  html:
    '<p class="govuk-body">Complex cases must be discussed and agreed with the receiving prison.</p><p class="govuk-body">This includes:<p><ul class="govuk-list govuk-list--bullet"><li>Segregated prisoners</li><li>Self harm/prisoners on ACCT</li><li>Mental health issues</li><li>Integrated Drug Treatment System</li></ul>',
  dependent: {
    field: 'move_agreed',
    value: 'false',
  },
}

module.exports = moveNotAgreedInstruction
