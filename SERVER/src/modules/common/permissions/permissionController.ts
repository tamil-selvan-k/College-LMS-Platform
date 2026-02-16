import { Request, Response as ExpressResponse } from 'express';
import { Response, CustomError } from '../../../utils';
import { STATUS_CODE } from '../../../constants';
import { hasPermissionService } from './permissionService';

export const hasPermissionController = async (req: Request, res: ExpressResponse) => {
  try {
    const permission = Array.isArray(req.params.permission) 
      ? req.params.permission[0] 
      : req.params.permission;

    const result = await hasPermissionService({ 
      permission, 
      prisma: req.tenantPrisma, 
      userId: req.user?.userId, 
      roleId: req.user?.roleId,
      isSuperAdmin: req.user?.isSuperAdmin 
    });

    return Response({
      res,
      data: result,
      message: 'Permission check successful',
      statusCode: STATUS_CODE.OK,
    });
  } catch (err: any) {
    return Response({
          res,
          data: null,
          message: err.message,
          statusCode: err instanceof CustomError ? err.statusCode : STATUS_CODE.INTERNAL_SERVER_ERROR,
        });
  }
}