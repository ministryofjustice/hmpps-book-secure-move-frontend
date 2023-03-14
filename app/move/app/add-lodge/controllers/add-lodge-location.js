"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddLodgeLocationController = void 0;
// @ts-ignore // TODO: convert to ts
const middleware1 = __importDefault(require("../../../../../common/middleware"));
const add_lodge_1 = require("./add-lodge");
class AddLodgeLocationController extends add_lodge_1.AddLodgeController {
    middlewareSetup() {
        super.middlewareSetup();
        // @ts-ignore // #use does exist
        this.use(middleware1.default.setLocationItems('prison', 'to_location_lodge'));
    }
    successHandler(req, res, next) {
        const _super = Object.create(null, {
            successHandler: { get: () => super.successHandler }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { to_location_lodge: toLocationId } = req.sessionModel.toJSON();
                if (toLocationId) {
                    const locationDetail = yield req.services.referenceData.getLocationById(toLocationId);
                    req.sessionModel.set('to_location_lodge', locationDetail);
                }
                // @ts-ignore // this exists
                _super.successHandler.call(this, req, res, next);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AddLodgeLocationController = AddLodgeLocationController;
