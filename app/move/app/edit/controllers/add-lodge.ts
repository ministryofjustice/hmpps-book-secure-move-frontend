// @ts-ignore // TODO: convert to ts
<<<<<<<< HEAD:app/move/app/edit/controllers/add-lodge.ts
import EditBase from './base'
========
import UpdateBaseController from '../../edit/controllers/base'
>>>>>>>> f5133e5c (chore: WIP add lodge form):app/move/app/add-lodge/controllers/base.ts

export class BaseController extends UpdateBaseController {
  middlewareSetup() {
    super.middlewareSetup()
  }

  getErrors(req: any, res: any) {
    const errors = super.getErrors(req, res)

    const referrer = req.get('referrer')
    console.log(
      'ERRORORORORORORS',
      errors,
      req.initialStep,
      req.query.referrer,
      referrer,
      (this as any).getBaseUrl(req)
    )

    if (referrer) {
      const { pathname } = new URL(referrer)
      console.log(pathname)
    }

    return errors
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
}
