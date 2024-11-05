import i18n from '../../config/i18n'
import { BasmRequest } from '../../common/types/basm_request'
import { BasmResponse } from '../../common/types/basm_response'
import { ErrorMessage } from '../../common/types/error_message'

const mapErrorMessages = (errors: string[]): ErrorMessage[] =>
    errors.map(error => ({
        error,
        message: i18n.t(`police-custody-form-errors::${error}`)
}))

export const addEvents = async (
    req: BasmRequest,
    res: BasmResponse
    ): Promise<void> => {
    const { user, move, journeys } = req
    const lockoutEvents = req.body
    const moveId = move.id

    const errors = [lockoutEvents.events || []]
        .flat()
        .filter((e: string) => lockoutEvents[e] === '')

    if (lockoutEvents.events === undefined || errors.length > 0) {
        const mappedErrors = mapErrorMessages(errors)
        res.locals.showErrorsSummary = true

        if (errors.length > 0) {
        res.locals.formErrors = mappedErrors
        res.locals.formData = req.body
        }

        delete res.breadcrumb
        return res.render('police-custody-form/police-custody-form')
    }

    await req.services.event?.postLockoutEvents(
        req,
        lockoutEvents,
        move,
        journeys, 
        user
    )
  
    const fullName = move.profile?.person._fullname || 'Unknown'

    req.flash('success', {
        title: req.t('messages::events_added.heading', {
        type: move.is_lockout ? 'Lockout' : 'Overnight lodge'
        }),
        content: req.t('messages::events_added.content', {
        fullName,
        type: move.is_lockout ? 'lockout' : 'overnight lodge'
        })
    })

    return res.redirect(`/move/${moveId}`)
}
