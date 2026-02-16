import { validationResult, body} from "express-validator";
import { Request, Response as ExpressResponse, NextFunction } from "express";
import { Response } from "../../../utils";
import { STATUS_CODE } from "../../../constants/appConstants";

export const authValidators = {
  login: [
    body('email')
      .exists({ checkFalsy: true })
      .withMessage('email is required')
      .isEmail()
      .withMessage('enter a correct email'),

    body('password')
      .exists({ checkFalsy: true })
      .withMessage('password is required')
      .isString()
      .withMessage('password must be a string'),
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