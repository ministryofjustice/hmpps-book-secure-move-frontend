const i18n = require('../../config/i18n').default
const filters = require('../../config/nunjucks/filters')

const presenter = require('./allocation-to-meta-list-component')

describe('allocation to meta list component', function () {
  const mockParams = {
    from_location: {
      id: 'ed286eb6-7bd6-4cb8-aaf6-02406fb42b88',
      type: 'locations',
      key: 'bwi',
      title: 'BERWYN (HMP)',
      location_type: 'prison',
      nomis_agency_id: 'BWI',
      can_upload_documents: false,
      disabled_at: null,
      suppliers: [],
    },
    to_location: {
      id: '31c262ba-1bab-4b6e-8c53-f0032eeaea0b',
      type: 'locations',
      key: 'gti',
      title: 'GARTREE (HMP)',
      location_type: 'prison',
      nomis_agency_id: 'GTI',
      can_upload_documents: false,
      disabled_at: null,
      suppliers: [],
    },
    date: '2020-05-06',
    moves: [
      {},
      {},
      {
        person: {
          first_names: 'John',
          last_name: 'Doe',
        },
      },
    ],
  }
  let output

  beforeEach(function () {
    sinon.stub(i18n, 't').returnsArg(0)
    sinon.stub(filters, 'formatDateWithRelativeDay').returnsArg(0)
    output = presenter(mockParams)
  })

  it('should contain classes', function () {
    expect(output).to.have.property('classes')
    expect(output.classes).to.equal('govuk-!-font-size-16')
  })

  it('outputs an array', function () {
    expect(output.items).to.exist
    expect(output.items).to.be.an('array')
    expect(output.items.length).to.equal(4)
  })

  it('has the number of prisoners as first item', function () {
    expect(output.items[0]).to.deep.equal({
      key: {
        text: 'fields::moves_count.label',
      },
      value: {
        text: 3,
      },
    })
  })

  it('has the move from as second item', function () {
    expect(output.items[1]).to.deep.equal({
      key: {
        text: 'fields::from_location.short_label',
      },
      value: {
        html: 'BERWYN (HMP)',
      },
    })
  })

  it('has the move to as third item', function () {
    expect(output.items[2]).to.deep.equal({
      key: {
        text: 'fields::move_type.short_label',
      },
      value: {
        text: 'GARTREE (HMP)',
      },
    })
  })

  it('has the date as fourth item', function () {
    expect(output.items[3]).to.deep.equal({
      key: {
        text: 'fields::date_type.label',
      },
      value: {
        text: '2020-05-06',
      },
    })
    expect(filters.formatDateWithRelativeDay).to.calledWithExactly('2020-05-06')
  })
})
