"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddLodgeSaveController = void 0;
const add_lodge_1 = require("./add-lodge");
class AddLodgeSaveController extends add_lodge_1.AddLodgeController {
    middlewareSetup() {
        super.middlewareSetup();
    }
    successHandler(req, res, next) {
        next();
    }
}
exports.AddLodgeSaveController = AddLodgeSaveController;
