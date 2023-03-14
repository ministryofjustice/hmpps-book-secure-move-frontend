"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddLodgeDateController = void 0;
const date_fns_1 = require("date-fns");
const add_lodge_1 = require("./add-lodge");
const filters = require('../../../../../config/nunjucks/filters');
class AddLodgeDateController extends add_lodge_1.AddLodgeController {
    middlewareSetup() {
        super.middlewareSetup();
        // @ts-ignore // #use does exist
        this.use(this.setDateType);
    }
    setDateType(req, res, next) {
        const { date_type_lodge: dateType } = req.form.options.fields;
        const { items } = dateType;
        items[0].text = req.t(items[0].text, {
            date: filters.formatDateWithDay(res.locals.TOMORROW),
        });
        items[1].text = req.t(items[1].text, {
            date: filters.formatDateWithDay(res.locals.DAY_AFTER_TOMORROW),
        });
        next();
    }
    process(req, res, next) {
        const { date_type_lodge: dateType } = req.form.values;
        // process move date
        let moveDate;
        if (dateType === 'custom') {
            moveDate = (0, date_fns_1.parseISO)(req.form.values.date_custom_lodge);
        }
        else {
            req.form.values.date_custom_lodge = '';
            moveDate =
                dateType === 'tomorrow'
                    ? res.locals.TOMORROW
                    : res.locals.DAY_AFTER_TOMORROW;
        }
        req.form.values.date = (0, date_fns_1.isValid)(moveDate)
            ? (0, date_fns_1.format)(moveDate, 'yyyy-MM-dd')
            : undefined;
        // TODO: A MoveOvernightLodge needs to be created at this point using the following vars
        // date = req.form.values.date
        // location id = req.sessionModel.attributes.to_location_lodge.id
        next();
    }
}
exports.AddLodgeDateController = AddLodgeDateController;
