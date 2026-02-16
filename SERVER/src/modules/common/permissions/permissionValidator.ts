import { validationResult, body, param} from "express-validator";
import { Request, Response as ExpressResponse, NextFunction } from "express";
import { Response } from "../../../utils";
import { STATUS_CODE } from "../../../constants/appConstants";


export const permissionValidator = {
  hasPermission: [
    param("permission").isLength({min: 1}).withMessage("permission is required"),
    validator
  ]
};


export function validator(req: Request, res: ExpressResponse, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorArray = errors.array();
    return Response({
      res,
      statusCode: STATUS_CODE.BAD_REQUEST,
      message: errorArray[0].msg,
      data: null
    });
  }
  next();
}