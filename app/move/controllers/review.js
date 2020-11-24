const { differenceInCalendarDays, parseISO } = require('date-fns')
const { pick, set } = require('lodash')

const FormWizardController = require('../../../common/controllers/form-wizard')
const presenters = require('../../../common/presenters')
const singleRequestService = require('../../../common/services/single-request')
const filters = require('../../../config/nunjucks/filters')

class ReviewController extends FormWizardController {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.setRebookOptions)
    this.use(this.updateDateHint)
  }

  middlewareLocals() {
    super.middlewareLocals()
    this.use(this.setMoveSummary)
  }

  middlewareChecks() {
    super.middlewareChecks()
    this.use(this.checkStatus)
    this.use(this.canAccess)
  }

  setRebookOptions(req, res, next) {
    const existingItems = req.form.options.fields.rebook.items
    const maxDate = req.move.date_to
    const isAboutToExpire =
      maxDate && differenceInCalendarDays(parseISO(maxDate), new Date()) <= 7

    if (isAboutToExpire) {
      set(
        req,
        'form.options.fields.rebook.items',
        existingItems.filter(item => {
          // intentionally a string -- the field stores it as such
          return item.value === 'false'
        })
      )
    }

    next()
  }

  checkStatus(req, res, next) {
    const { id, status } = req.move

    if (status !== 'proposed') {
      return res.redirect(`/move/${id}`)
    }

    next()
  }

  canAccess(req, res, next) {
    const { canAccess } = res.locals
    const { id: moveId } = req.move

    if (canAccess('move:review', req.session.user.permissions)) {
      return next()
    }

    res.redirect(`/move/${moveId}`)
  }

  updateDateHint(req, res, next) {
    const { move_date: moveDate } = req.form.options.fields
    const { date_to: dateTo, date_from: dateFrom } = req.move

    moveDate.hint.text = req.t(moveDate.hint.text, {
      context: dateTo ? 'with_date_range' : 'with_date',
      date: filters.formatDateRange([dateFrom, dateTo], 'and'),
    })

    next()
  }

  setMoveSummary(req, res, next) {
    const { move } = req

    res.locals.move = move
    res.locals.person = move.profile.person
    res.locals.moveSummary = presenters.moveToMetaListComponent(move)

    next()
  }

  async successHandler(req, res, next) {
    const { id: moveId } = req.move
    const data = pick(
      req.sessionModel.toJSON(),
      Object.keys(req.form.options.allFields)
    )

    try {
      if (data.review_decision === 'reject') {
        data.cancellation_reason_comment =
          data.cancellation_reason_other_comment
        delete data.cancellation_reason_other_comment
        await singleRequestService.reject(moveId, data)
      }

      if (data.review_decision === 'approve') {
        await singleRequestService.approve(moveId, {
          date: data.move_date,
        })
      }

      req.journeyModel.reset()
      req.sessionModel.reset()

      res.redirect(
        data.review_decision === 'approve'
          ? `/move/${moveId}/confirmation`
          : `/move/${moveId}`
      )
    } catch (error) {
      next(error)
    }
  }
}

module.exports = ReviewController
