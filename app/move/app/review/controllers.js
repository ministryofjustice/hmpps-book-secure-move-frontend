const { differenceInCalendarDays, parseISO } = require('date-fns')
const { get, pick, set } = require('lodash')

const FormWizardController = require('../../../../common/controllers/form-wizard')
const middleware = require('../../../../common/middleware')
const filters = require('../../../../config/nunjucks/filters')

class ReviewController extends FormWizardController {
  middlewareSetup() {
    super.middlewareSetup()
    this.use(this.setRebookOptions)
    this.use(this.updateDateHint)
  }

  middlewareLocals() {
    super.middlewareLocals()
    this.use(middleware.setMoveSummary)
    this.use(this.setReviewLocals)
  }

  middlewareChecks() {
    this.use(this.checkStatus)
    this.use(this.canAccess)
    super.middlewareChecks()
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

  setReviewLocals(req, res, next) {
    const { move } = req

    res.locals.move = move

    next()
  }

  async successHandler(req, res, next) {
    const { id: moveId } = req.move
    const data = pick(
      req.sessionModel.toJSON(),
      Object.keys(req.form.options.allFields)
    )

    const singleRequestService = req.services.singleRequest

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

  errorHandler(err, req, res, next) {
    const apiErrorCode = get(err, 'errors[0].code')

    if (err.statusCode === 422 && apiErrorCode === 'taken') {
      const existingMoveId = get(err, 'errors[0].meta.existing_id')
      const moveDate = req.sessionModel.get('move_date')

      return res.render('action-prevented', {
        pageTitle: req.t('validation::move_conflict.heading', {
          context: 'review',
        }),
        message: req.t('validation::move_conflict.message', {
          href: `/move/${existingMoveId}`,
          name: req.move.profile.person._fullname,
          location: req.move.to_location.title,
          date: filters.formatDateWithDay(moveDate),
        }),
        instruction: req.t('validation::move_conflict.instructions', {
          context: 'review',
          date_href: '',
        }),
      })
    }

    super.errorHandler(err, req, res, next)
  }
}

module.exports = {
  ReviewController,
}
