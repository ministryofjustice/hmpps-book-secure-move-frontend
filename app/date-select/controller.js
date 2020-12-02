const FormWizardController = require('../../common/controllers/form-wizard')
const { dateRegex } = require('../../common/helpers/url')

const DateRegExp = new RegExp('/' + dateRegex)

class DateSelectController extends FormWizardController {
  middlewareChecks(req, res, next) {
    super.middlewareChecks(req, res, next)
    this.use(this.checkReferrer)
  }

  checkReferrer(req, res, next) {
    // if someone enters the url directly without a referrer
    if (!req.query.referrer) {
      return res.redirect('/')
    }

    next()
  }

  get(req, res, next) {
    const { errorList } = this.getErrors(req, res)

    // if no errors, a post just failed
    // otherwise coming in clean, so clear any previous value stored for date
    // NB. relies on clearing errors before rendering
    if (!errorList.length) {
      req.sessionModel.reset()
    }

    const { referrer } = req.query

    res.locals.cancelUrl = referrer
    res.locals.backLink = referrer

    super.get(req, res, next)
  }

  render(req, res, next) {
    // clear errors before rendering
    this.setErrors(null, req, res)
    super.render(req, res, next)
  }

  successHandler(req, res, next) {
    const { referrer } = req.query

    const { date_select: dateSelect } = req.form.values

    const redirectUrl = referrer.replace(DateRegExp, `/${dateSelect}`)
    return res.redirect(redirectUrl)
  }
}

module.exports = DateSelectController
