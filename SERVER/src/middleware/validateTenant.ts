// Tenant Validation Middleware
// Validates college_id from JWT and injects tenant connection
import { Request, Response as ExpressResponse, NextFunction } from 'express';
import { Response } from '../utils/response';
import { STATUS_CODE } from '../constants/appConstants';
import logger from '../config/logger';
import getAdminPrisma from '../config/adminPrisma';
import getTenantConnection from '../config/tenantPool';

// Extend Express Request to include tenant context
declare global {
  namespace Express {
    interface Request {
      tenant?: {
        college_id: number;
        college_name: string;
        uniq_string: string;
      };
      tenantPrisma?: any;
      user?: {
        user_id: number;
        role_id: number;
        college_id: number;
      };
    }
  }
}

/**
 * Middleware to validate tenant and inject connection
 * Expects college_id in req.user (from JWT)
 */
export async function validateTenant(
  req: Request,
  res: ExpressResponse,
  next: NextFunction
): Promise<void> {
  try {
    // Get college_id from JWT (already decoded by auth middleware)
    const college_id = req.user?.college_id;

    if (!college_id) {
      Response({
        res,
        data: null,
        statusCode: STATUS_CODE.UNAUTHORIZED,
        message: 'College ID not found in token',
      });
      return;
    }

    // Get admin database connection
    const adminPrisma = getAdminPrisma();

    // Check if college exists in lms_admin
    const tenant = await adminPrisma.tenants.findFirst({
      where: {
        id: college_id,
        is_active: true,
      },
      select: {
        id: true,
        college_name: true,
        uniq_string: true,
        db_string: true,
      },
    });

    if (!tenant) {
      Response({
        res,
        data: null,
        statusCode: STATUS_CODE.FORBIDDEN,
        message: 'College not found or inactive',
      });
      return;
    }

    // Get tenant database connection from pool
    const tenantPrisma = getTenantConnection(tenant.db_string, tenant.id);

    // Inject tenant context into request
    req.tenant = {
      college_id: tenant.id,
      college_name: tenant.college_name,
      uniq_string: tenant.uniq_string,
    };
    req.tenantPrisma = tenantPrisma;

    next();
  } catch (error) {
    logger.error('Tenant validation error:', error);
    Response({
      res,
      data: null,
      statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
      message: 'Failed to validate tenant',
    });
  }
}

export default validateTenant;
