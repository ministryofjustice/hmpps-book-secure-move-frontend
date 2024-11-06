"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("./controllers");
const router = (0, express_1.Router)({ mergeParams: true });
router.get('/', (req, res) => {
    const basmRes = res;
    delete basmRes.breadcrumb;
    basmRes.render('police-custody-form/police-custody-form');
});
router.post('/', (req, res) => {
    const basmReq = req;
    (0, controllers_1.addEvents)(basmReq, res);
});
module.exports = {
    router,
    mountpath: '/police-custody-form',
};
