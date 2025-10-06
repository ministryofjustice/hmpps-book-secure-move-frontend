// @ts-nocheck
import FormWizardController from '../../../common/controllers/form-wizard'
import { isFuture, parseISO, set } from 'date-fns'

export class StakeholderEvent extends FormWizardController {
  process (req, res, next) {
    console.log('Process')
    console.log(req.body)

    next()
  }

  validateFields (req, res, callback) {
    super.validateFields(req, res, errors => {
      // Don't apply this extra validation unless we have both date and time
      if (
        !req.form.values.event_date ||
        !req.form.values.event_time
      ) {
        return callback(errors)
      }

      // If the date is in the future, don't confuse things with extra error messages
      const parsedDate = parseISO(req.form.values.event_date)

      if (isFuture(parsedDate)) {
        return callback(errors)
      }

      const timeParts = req.form.values.event_time.split(':')
      const eventDateTime = set(parsedDate, {
        hours: timeParts[0],
        minutes: timeParts[1]
      })

      let eventTimeError

      if (isFuture(eventDateTime)) {
        eventTimeError = new this.Error('event_time', {
          errorGroup: 'event_time',
          type: 'before'
        })
      }

      const formErrors = {
        ...(eventTimeError && { event_time: eventTimeError }),
        ...errors
      }
      console.log('validateFields')
      console.log(req.body)

      console.log(req.form.values)
      callback(formErrors)
    })
  }
}

export class SaveController extends FormWizardController {
  saveValues (req, res, next) {
    console.log('Save')
    console.log(req.body)
    const { stakeholder_group: stakeholder, event_date: date, event_time: time, event_summary: summary, further_details: details } = req.sessionModel.attributes

    console.log(stakeholder)
    console.log(date)
    console.log(time)
    console.log(summary)
    console.log(details)

    const occurredAt = new Date(date)
    occurredAt.setHours(time.split(':')[0], time.split(':')[1])

    console.log(req.sessionModel)

    const postData = {
      stakeholder,
      summary,
      details,
      occurredAt
    }

    req.services.event.postStakeholderEvent(req, postData)

    next()
  }
}

export class RedirectController extends FormWizardController {
  async successHandler (req, res, next) {
    const move = req.move
    res.redirect(`/move/${move.id}/record-event/success`)
  }
}

export function success (req, res) {
  const move = req.move

  res.render('stakeholder-event-form/success', { move })
}
