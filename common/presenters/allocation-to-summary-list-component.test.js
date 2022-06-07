const i18n = require('../../config/i18n').default
const filters = require('../../config/nunjucks/filters')

const presenter = require('./allocation-to-summary-list-component')

describe('allocation to summary list component', function () {
  const mockParams = {
    to_location: {
      id: '31c262ba-1bab-4b6e-8c53-f0032eeaea0b',
      title: 'GARTREE (HMP)',
      location_type: 'prison',
    },
    prisoner_category: 'c',
    estate: 'adult_male',
    complex_cases: [
      {
        key: 'hold_separately',
        title: 'Segregated prisoners',
        answer: true,
        allocation_complex_case_id: 'afa79a37-7c2f-4363-bed6-e1ccf2576901',
      },
      {
        key: 'self_harm',
        title: 'Self harm / prisoners on ACCT',
        answer: true,
        allocation_complex_case_id: 'e8e8af77-198c-4b64-adb1-4aca6af469a7',
      },
      {
        key: 'mental_health_issue',
        title: 'Mental health issues',
        answer: false,
        allocation_complex_case_id: 'c0d196aa-a96d-4296-8349-f52b9909a2b8',
      },
      {
        key: 'under_drug_treatment',
        title: 'Integrated Drug Treatment System',
        answer: false,
        allocation_complex_case_id: '6f35f300-e3ed-4536-8f19-5954fc8b9963',
      },
    ],
    other_criteria: 'Other criteria',
  }
  let output
  beforeEach(function () {
    sinon.stub(i18n, 't').returnsArg(0)
    sinon.stub(filters, 'oxfordJoin').returnsArg(0)
    output = presenter(mockParams)
  })
  it('outputs an array', function () {
    expect(output.rows).to.exist
    expect(output.rows).to.be.an('array')
    expect(output.rows.length).to.equal(5)
  })
  context('has the prisoner estate as first item', function () {
    it('and it is a category', function () {
      expect(output.rows[0]).to.deep.equal({
        key: {
          text: 'fields::estate.label',
        },
        value: {
          text: ['fields::estate.items.adult_male', ''],
        },
      })
    })
    it('and it is a comment', function () {
      const output = presenter({
        ...mockParams,
        estate_comment: 'This is a comment',
      })
      expect(output.rows[0]).to.deep.equal({
        key: {
          text: 'fields::estate.label',
        },
        value: {
          text: ['fields::estate.items.adult_male', 'This is a comment'],
        },
      })
    })
  })
  context('has the prisoner category as second item', function () {
    it('has the prisoner category as second item', function () {
      expect(output.rows[1]).to.deep.equal({
        key: {
          text: 'fields::prisoner_common_category.label',
        },
        value: {
          text: [
            'fields::prisoner_adult_male.items.c',
            'fields::prisoner_common_category.items.c',
            'fields::prisoner_common_category.items.na',
          ],
        },
      })
    })
    it('unless it is not applicable', function () {
      const output = presenter({ ...mockParams, prisoner_category: undefined })
      expect(output.rows[1]).to.deep.equal({
        key: {
          text: 'fields::prisoner_common_category.label',
        },
        value: {
          text: [
            'fields::prisoner_adult_male.items.undefined',
            'fields::prisoner_common_category.items.undefined',
            'fields::prisoner_common_category.items.na',
          ],
        },
      })
    })
  })
  context('has the sentence length as third item', function () {
    it('and it is a predefined value', function () {
      expect(output.rows[2]).to.deep.equal({
        key: {
          text: 'fields::sentence_length.label',
        },
        value: {
          text: 'fields::sentence_length.items.length',
        },
      })
      expect(filters.oxfordJoin).to.have.been.calledWithExactly([
        'Segregated prisoners',
        'Self harm / prisoners on ACCT',
      ])
    })
    it('and it is a comment', function () {
      const output = presenter({
        ...mockParams,
        sentence_length_comment: 'This is a comment',
      })
      expect(output.rows[2]).to.deep.equal({
        key: {
          text: 'fields::sentence_length.label',
        },
        value: {
          text: 'This is a comment',
        },
      })
    })
  })
  it('has the complex cases as four item, filtering those whose answer is false', function () {
    expect(output.rows[3]).to.deep.equal({
      key: {
        text: 'fields::complex_cases.label',
      },
      value: {
        text: ['Segregated prisoners', 'Self harm / prisoners on ACCT'],
      },
    })
    expect(filters.oxfordJoin).to.have.been.calledWithExactly([
      'Segregated prisoners',
      'Self harm / prisoners on ACCT',
    ])
  })
  it('has the other criteria as fifth item', function () {
    expect(output.rows[4]).to.deep.equal({
      key: {
        text: 'fields::other_criteria.label',
      },
      value: {
        text: 'Other criteria',
      },
    })
  })
})
