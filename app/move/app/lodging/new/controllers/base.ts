// @ts-ignore // TODO: convert to ts
import { get } from 'lodash'

import * as filters from '../../../../../../config/nunjucks/filters'
// @ts-ignore
import UpdateBaseController from '../../../edit/controllers/base'

export class BaseController extends UpdateBaseController {
  middlewareSetup() {
    super.middlewareSetup()
  }

  setNextStep(req: any, res: any, next: any) {
    next()
  }

  canEdit(req: any, res: any, next: Function) {
    const { id, status } = req.getMove()

    if (['completed', 'cancelled'].includes(status)) {
      return res.redirect(`/move/${id}`)
    }

    next()
  }

  setButtonText(req: any, res: any, next: () => void) {
    // @ts-ignore // #getNextStep does exist
    const nextStep = this.getNextStep(req, res)
    const steps = Object.keys(req.form.options.steps)
    const lastStep = steps[steps.length - 1]
    const buttonText = nextStep.includes(lastStep)
      ? 'actions::add_lodge'
      : 'actions::continue'

    req.form.options.buttonText = req.form.options.buttonText || buttonText

    next()
  }

  errorHandler(err: any, req: any, res: any, next: () => void) {
    const apiErrorCode = get(err, 'errors[0].code')

    if (err.statusCode === 422 && apiErrorCode === 'taken') {
      const existingMoveId = get(err, 'errors[0].meta.existing_id')
      const move = {
        ...req.getMove(),
        ...req.form.values,
      }

      return res.render('action-prevented', {
        backLink: `/move/${move.id}`,
        pageTitle: req.t('validation::lodging_conflict.heading', {
          context: 'create',
        }),
        message: req.t('validation::lodging_conflict.message', {
          context: 'create',
          href: `/move/${existingMoveId}`,
          name: move.profile.person._fullname,
          date: filters.formatDateWithDay(move.date),
        }),
      })
    }

    super.errorHandler(err, req, res, next)
  }
}
