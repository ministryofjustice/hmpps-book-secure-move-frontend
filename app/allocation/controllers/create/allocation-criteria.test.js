const Controller = require('./allocation-criteria')
const ParentController = require('./base')
const controller = new Controller({
  route: '/',
})

describe('Allocation criteria controller', function () {
  describe('#configure', function () {
    let req
    let next
    let referenceDataService
    context('happy path', function () {
      beforeEach(async function () {
        referenceDataService = {
          getAllocationComplexCases: sinon.stub().resolves([
            {
              id: 'afa79a37-7c2f-4363-bed6-e1ccf2576901',
              type: 'allocation_complex_cases',
              key: 'hold_separately',
              title: 'Segregated prisoners',
            },
            {
              id: 'e8e8af77-198c-4b64-adb1-4aca6af469a7',
              type: 'allocation_complex_cases',
              key: 'self_harm',
              title: 'Self harm / prisoners on ACCT',
            },
            {
              id: 'c0d196aa-a96d-4296-8349-f52b9909a2b8',
              type: 'allocation_complex_cases',
              key: 'mental_health_issue',
              title: 'Mental health issues',
            },
            {
              id: '6f35f300-e3ed-4536-8f19-5954fc8b9963',
              type: 'allocation_complex_cases',
              key: 'under_drug_treatment',
              title: 'Integrated Drug Treatment System',
            },
            {
              id: '6f35f300-e3ed-4536-8f19-5954fc8b9965',
              type: 'allocation_complex_cases',
              key: 'disabled_items',
              disabled_at: 2548972800000,
            },
          ]),
        }
        req = {
          form: {
            options: {
              fields: {
                complex_cases: {},
              },
            },
          },
          services: {
            referenceData: referenceDataService,
          },
        }
        next = sinon.stub()
        await controller.configure(req, {}, next)
      })
      it('calls the reference service', function () {
        expect(referenceDataService.getAllocationComplexCases).to.have.been
          .calledOnce
      })
      it('sets the items as items on the complex cases field', function () {
        expect(req.form.options.fields.complex_cases.items).to.exist
      })
      it('filters the disabled items', function () {
        expect(req.form.options.fields.complex_cases.items.length).to.equal(4)
      })
      it('sets as checked every item', function () {
        expect(req.form.options.fields.complex_cases.items).to.deep.equal([
          {
            value: 'afa79a37-7c2f-4363-bed6-e1ccf2576901',
            text: 'Segregated prisoners',
            key: 'hold_separately',
            checked: true,
          },
          {
            value: 'e8e8af77-198c-4b64-adb1-4aca6af469a7',
            text: 'Self harm / prisoners on ACCT',
            key: 'self_harm',
            checked: true,
          },
          {
            value: 'c0d196aa-a96d-4296-8349-f52b9909a2b8',
            text: 'Mental health issues',
            key: 'mental_health_issue',
            checked: true,
          },
          {
            value: '6f35f300-e3ed-4536-8f19-5954fc8b9963',
            text: 'Integrated Drug Treatment System',
            key: 'under_drug_treatment',
            checked: true,
          },
        ])
      })
      it('calls next', function () {
        expect(next).to.have.been.calledOnce
      })
    })
    context('unhappy path', function () {
      let next
      const error = new Error('error')
      beforeEach(async function () {
        next = sinon.stub()
        req.services.referenceData.getAllocationComplexCases = sinon
          .stub()
          .throws(error)
        await controller.configure(req, {}, next)
      })
      it('calls next with an error', function () {
        expect(next).to.have.been.calledWithExactly(error)
      })
    })
  })
  describe('#saveValues', function () {
    let req
    let mockValues
    let mockComplexCaseFields
    let transformedValues
    beforeEach(function () {
      sinon.stub(ParentController.prototype, 'saveValues')
      mockValues = {
        complex_cases: [
          'afa79a37-7c2f-4363-bed6-e1ccf2576901',
          'e8e8af77-198c-4b64-adb1-4aca6af469a7',
        ],
        complete_in_full: 'false',
        prisoner_adult_female: undefined,
        prisoner_adult_male: undefined,
        prisoner_young_offender_female: undefined,
        prisoner_young_offender_male: 'open',
      }
      mockComplexCaseFields = [
        {
          value: 'afa79a37-7c2f-4363-bed6-e1ccf2576901',
          text: 'Segregated prisoners',
          key: 'hold_separately',
        },
        {
          value: 'e8e8af77-198c-4b64-adb1-4aca6af469a7',
          text: 'Self harm / prisoners on ACCT',
          key: 'self_harm',
        },
        {
          value: 'c0d196aa-a96d-4296-8349-f52b9909a2b8',
          text: 'Mental health issues',
          key: 'mental_health_issue',
        },
        {
          value: '6f35f300-e3ed-4536-8f19-5954fc8b9963',
          text: 'Integrated Drug Treatment System',
          key: 'under_drug_treatment',
        },
      ]
      transformedValues = [
        {
          key: 'hold_separately',
          title: 'Segregated prisoners',
          allocation_complex_case_id: 'afa79a37-7c2f-4363-bed6-e1ccf2576901',
          answer: true,
        },
        {
          key: 'self_harm',
          title: 'Self harm / prisoners on ACCT',
          allocation_complex_case_id: 'e8e8af77-198c-4b64-adb1-4aca6af469a7',
          answer: true,
        },
        {
          key: 'mental_health_issue',
          title: 'Mental health issues',
          allocation_complex_case_id: 'c0d196aa-a96d-4296-8349-f52b9909a2b8',
          answer: false,
        },
        {
          key: 'under_drug_treatment',
          title: 'Integrated Drug Treatment System',
          allocation_complex_case_id: '6f35f300-e3ed-4536-8f19-5954fc8b9963',
          answer: false,
        },
      ]
      req = {
        form: {
          values: mockValues,
          options: {
            fields: {
              complete_in_full: {},
              complex_cases: {
                items: mockComplexCaseFields,
              },
            },
          },
        },
      }
      controller.saveValues(req, {}, () => {})
    })
    it('transforms the values of complex_cases in the format expected by the backend', function () {
      expect(req.form.values.complex_cases).to.deep.equal(transformedValues)
    })
    it('transforms the values of prison_category in the format expected by the backend', function () {
      expect(req.form.values.prisoner_category).to.be.equal('open')
    })
    it('does pass other values unchanged', function () {
      expect(req.form.values.complete_in_full).to.equal('false')
    })
    it('calls the parent save values', function () {
      expect(ParentController.prototype.saveValues).to.have.been.called
    })
  })
})
