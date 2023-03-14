import { AddLodgeController } from './add-lodge'

export class AddLodgeSaveController extends AddLodgeController {
  middlewareSetup() {
    super.middlewareSetup()
  }

  successHandler(req: any, res: any, next: any) {
    next()
  }
}
