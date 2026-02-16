import { Request, Response as ExpressResponse, NextFunction } from 'express';
import { Response, CustomError } from '../utils';
import { STATUS_CODE } from '../constants';
import logger from '../config/logger';

/**
 * Permission Validation Middleware Factory
 * Creates middleware that checks if the user has the required permission
 * Super admins automatically bypass permission checks
 * 
 * @param permission - The permission string to check (e.g., 'LMS_USER_CREATE')
 * @returns Express middleware function
 */
export const checkPermission = (permission: string) => {
  return async (req: Request, res: ExpressResponse, next: NextFunction): Promise<void> => {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        Response({
          res,
          data: null,
          statusCode: STATUS_CODE.UNAUTHORIZED,
          message: 'Authentication required',
        });
        return;
      }

      // Ensure tenant database is available
      if (!req.tenantPrisma) {
        Response({
          res,
          data: null,
          statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
          message: 'Tenant database not initialized',
        });
        return;
      }

      // Super admins bypass all permission checks
      if (req.user.isSuperAdmin) {
        logger.info(`Super admin ${req.user.userId} bypassed permission check for: ${permission}`);
        next();
        return;
      }

      // Check if the user's role has the required permission
      const hasPermission = await req.tenantPrisma.role_permissions.findFirst({
        where: {
          role: req.user.roleId,
          permissions: {
            permission: permission,
          },
        },
        include: {
          permissions: true,
        },
      });

      if (!hasPermission) {
        logger.warn(`User ${req.user.userId} (role ${req.user.roleId}) denied access - missing permission: ${permission}`);
        Response({
          res,
          data: null,
          statusCode: STATUS_CODE.FORBIDDEN,
          message: `Insufficient permissions. Required: ${permission}`,
        });
        return;
      }

      logger.info(`User ${req.user.userId} granted access with permission: ${permission}`);
      next();
    } catch (error: any) {
      logger.error('Permission validation error:', error);
      
      Response({
        res,
        data: null,
        statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
        message: error.message || 'Error validating permissions',
      });
    }
  };
};
