"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEvents = void 0;
const i18n_1 = __importDefault(require("../../config/i18n"));
const mapErrorMessages = (errors) => errors.map(error => ({
    error,
    message: i18n_1.default.t(`police-custody-form-errors::${error}`)
}));
const addEvents = async (req, res) => {
    const { user, move, journeys } = req;
    const lockoutEvents = req.body;
    const moveId = move.id;
    const errors = [lockoutEvents.events || []]
        .flat()
        .filter((e) => lockoutEvents[e] === '');
    if (lockoutEvents.events === undefined || errors.length > 0) {
        const mappedErrors = mapErrorMessages(errors);
        res.locals.showErrorsSummary = true;
        if (errors.length > 0) {
            res.locals.formErrors = mappedErrors;
            res.locals.formData = req.body;
        }
        delete res.breadcrumb;
        return res.render('police-custody-form/police-custody-form');
    }
    await req.services.event?.postLockoutEvents(req, lockoutEvents, move, journeys, user);
    const fullName = move.profile?.person._fullname || 'Unknown';
    req.flash('success', {
        title: req.t('messages::events_added.heading', {
            type: move.is_lockout ? 'Lockout' : 'Overnight lodge'
        }),
        content: req.t('messages::events_added.content', {
            fullName,
            type: move.is_lockout ? 'lockout' : 'overnight lodge'
        })
    });
    return res.redirect(`/move/${moveId}`);
};
exports.addEvents = addEvents;
