import { faker } from '@faker-js/faker'
import { Selector, t } from 'testcafe'

import { fillInForm } from '../_helpers'

import { Page } from './page'

class ConfirmPersonEscortRecordPage extends Page {
  fields: {
    handoverDispatchingOfficer: Selector
    handoverDispatchingOfficerId: Selector
    handoverDispatchingOfficerContact: Selector
    handoverReceivingOfficer: Selector
    handoverReceivingOfficerId: Selector
    handoverReceivingOfficerContact: Selector
    handoverReceivingOrganisation: Selector
    handoverOtherOrganisation: Selector
    handoverOccurredAt: Selector
    confirmationCheckbox: Selector
  }

  constructor() {
    super()

    this.fields = {
      handoverDispatchingOfficer: Selector('#handover_dispatching_officer'),
      handoverDispatchingOfficerId: Selector(
        '#handover_dispatching_officer_id'
      ),
      handoverDispatchingOfficerContact: Selector(
        '#handover_dispatching_officer_contact'
      ),
      handoverReceivingOfficer: Selector('#handover_receiving_officer'),
      handoverReceivingOfficerId: Selector('#handover_receiving_officer_id'),
      handoverReceivingOfficerContact: Selector(
        '#handover_receiving_officer_contact'
      ),
      handoverReceivingOrganisation: Selector(
        '[name="handover_receiving_organisation"]'
      ),
      handoverOtherOrganisation: Selector('#handover_other_organisation'),
      handoverOccurredAt: Selector('[name="handover_occurred_at"]'),
      confirmationCheckbox: Selector('[name="confirm_handover"]'),
    }
  }

  /**
   * Fill in Handover details
   *
   * @returns {Promise<FormDetails>}
   */
  async fillIn() {
    await t.click(this.fields.confirmationCheckbox)

    return fillInForm({
      handoverDispatchingOfficer: {
        selector: this.fields.handoverDispatchingOfficer,
        value: `${faker.person.firstName()} ${faker.person.lastName()}`,
      },
      handoverDispatchingOfficerId: {
        selector: this.fields.handoverDispatchingOfficerId,
        value: faker.string.alphanumeric(6),
      },
      handoverDispatchingOfficerContact: {
        selector: this.fields.handoverDispatchingOfficerContact,
        value: faker.phone.number(),
      },
      handoverReceivingOfficer: {
        selector: this.fields.handoverReceivingOfficer,
        value: `${faker.person.firstName()} ${faker.person.lastName()}`,
      },
      handoverReceivingOfficerId: {
        selector: this.fields.handoverReceivingOfficerId,
        value: faker.string.alphanumeric(6),
      },
      handoverReceivingOfficerContact: {
        selector: this.fields.handoverReceivingOfficerContact,
        value: faker.phone.number(),
      },
      handoverReceivingOrganisation: {
        selector: this.fields.handoverReceivingOrganisation,
        value: 'Another organisation',
        type: 'radio',
      },
      handoverOtherOrganisation: {
        selector: this.fields.handoverOtherOrganisation,
        value: faker.company.name(),
      },
      handoverOccurredAt: {
        selector: this.fields.handoverOccurredAt,
        value: 'Now',
        type: 'radio',
      },
    })
  }
}

export default ConfirmPersonEscortRecordPage
