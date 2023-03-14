"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddLodgeController = void 0;
// @ts-ignore // TODO: convert to ts
const base1 = __importDefault(require("../../edit/controllers/base"));
class AddLodgeController extends base1.default {
    middlewareSetup() {
        super.middlewareSetup();
    }
    setNextStep(req, res, next) {
        next();
    }
    canEdit(req, res, next) {
        const { id, status } = req.getMove();
        if (['completed', 'cancelled'].includes(status)) {
            return res.redirect(`/move/${id}`);
        }
        next();
    }
    setButtonText(req, res, next) {
        // @ts-ignore // #getNextStep does exist
        const nextStep = this.getNextStep(req, res);
        const steps = Object.keys(req.form.options.steps);
        const lastStep = steps[steps.length - 1];
        const buttonText = nextStep.includes(lastStep)
            ? 'actions::add_lodge'
            : 'actions::continue';
        req.form.options.buttonText = req.form.options.buttonText || buttonText;
        next();
    }
}
exports.AddLodgeController = AddLodgeController;
