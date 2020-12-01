const FormWizardController = require('../../common/controllers/form-wizard')
const { dateRegex } = require('../../common/helpers/url')

const DateRegExp = new RegExp('/' + dateRegex)

class DateSelectController extends FormWizardController {
  middlewareChecks(req, res, next) {
    super.middlewareChecks(req, res, next)
    this.use(this.checkReferrer)
  }

  checkReferrer(req, res, next) {
    if (req.query.referrer) {
      req.sessionModel.reset()
      req.sessionModel.set('referrer', req.query.referrer)
      return res.redirect(req.form.options.fullPath)
    }

    const referrer = req.sessionModel.get('referrer')

    // if someone has opened up the jump-to-date page in 2 tabs then maybe, just maybe, the session model won't have the referrer info. In that case, the best we can do is go back to the start. Or of course, maybe someone enters the url directly without a referrer
    if (!referrer) {
      return res.redirect('/')
    }

    next()
  }

  get(req, res, next) {
    const referrer = req.sessionModel.get('referrer')

    res.locals.cancelUrl = referrer
    res.locals.backLink = referrer

    super.get(req, res, next)
  }

  successHandler(req, res, next) {
    const { date_select: dateSelect, referrer } = req.sessionModel.toJSON()

    req.sessionModel.reset()
    const redirectUrl = referrer.replace(DateRegExp, `/${dateSelect}`)
    return res.redirect(redirectUrl)
  }
}

module.exports = DateSelectController
