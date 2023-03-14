"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddLodgeSaveController = void 0;
const addLodge1 = require("./add-lodge");
class AddLodgeSaveController extends addLodge1.AddLodgeController {
    middlewareSetup() {
        super.middlewareSetup();
    }
    successHandler(req, res, next) {
        next();
    }
}
exports.AddLodgeSaveController = AddLodgeSaveController;
