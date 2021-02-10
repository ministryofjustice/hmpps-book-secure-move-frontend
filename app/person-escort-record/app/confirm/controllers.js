const { formatISO, parseISO, set } = require('date-fns')

const ConfirmAssessmentController = require('../../../../common/controllers/framework/confirm-assessment')

class HandoverController extends ConfirmAssessmentController {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.setSupplier)
  }

  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setBreadcrumb)
  }

  setBreadcrumb(req, res, next) {
    res.breadcrumb({
      text: req.t(req.form.options.pageTitle),
      href: '',
    })

    next()
  }

  setSupplier(req, res, next) {
    const supplierName = req.move?.supplier?.name

    if (supplierName) {
      const { fields } = req.form.options
      const item = fields.handover_receiving_organisation.items[0]

      item.text = supplierName
      item.value = supplierName
    }

    next()
  }

  async saveValues(req, res, next) {
    try {
      const values = req.form.values

      // process organisation
      if (values.handover_receiving_organisation === 'other') {
        values.handover_receiving_organisation =
          values.handover_other_organisation
      }

      // process handover time
      if (values.handover_occurred_at === 'now') {
        values.handover_occurred_at = formatISO(new Date())
      } else if (values.handover_occurred_at === 'other') {
        const timeParts = values.handover_other_time.split(':')
        const parsedDate = parseISO(values.handover_other_date)
        const handoverDate = set(parsedDate, {
          hours: timeParts[0],
          minutes: timeParts[1],
        })

        values.handover_occurred_at = formatISO(handoverDate)
      }

      const {
        handover_occurred_at: handoverOccurredAt,
        handover_dispatching_officer: dispatchingOfficer,
        handover_dispatching_officer_id: dispatchingOfficerId,
        handover_dispatching_officer_contact: dispatchingOfficerContact,
        handover_receiving_officer: receivingOfficer,
        handover_receiving_officer_id: receivingOfficerId,
        handover_receiving_officer_contact: receivingOfficerContact,
        handover_receiving_organisation: receivingOrganisation,
      } = values

      await req.services.personEscortRecord.confirm(req.assessment.id, {
        handoverOccurredAt,
        dispatchingOfficer,
        dispatchingOfficerId,
        dispatchingOfficerContact,
        receivingOfficer,
        receivingOfficerId,
        receivingOfficerContact,
        receivingOrganisation,
      })

      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = {
  HandoverController,
}
