import { PrismaClient as TenantPrismaClient } from '@prisma/tenant-client';
import { CustomError } from '../../../utils';
import { STATUS_CODE } from '../../../constants';
import logger from '../../../config/logger';

interface HasPermissionParams {
  permission: string;
  prisma?: TenantPrismaClient;
  userId?: number;
  roleId?: number;
  isSuperAdmin?: boolean;
}

/**
 * Service function to check if a user has a specific permission
 * Super admins automatically have all permissions
 */
export const hasPermissionService = async ({
  permission,
  prisma,
  userId,
  roleId,
  isSuperAdmin = false
}: HasPermissionParams) => {
  // Validate required parameters
  if (!prisma) {
    throw new CustomError({
      message: 'Tenant database not available',
      statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }

  if (!userId || !roleId) {
    throw new CustomError({
      message: 'User ID and Role ID are required',
      statusCode: STATUS_CODE.BAD_REQUEST,
    });
  }

  // Super admins have all permissions
  if (isSuperAdmin) {
    logger.info(`Super admin ${userId} has permission: ${permission}`);
    return {
      hasPermission: true,
      isSuperAdmin: true,
    };
  }

  // Check role-based permissions
  // First, get the permission ID
  const permissionRecord = await prisma.permissions.findFirst({
    where: { permission: permission },
    select: { id: true },
  });

  if (!permissionRecord) {
    logger.warn(`Permission ${permission} not found in database`);
    throw new CustomError({
      message: `Permission ${permission} not found`,
      statusCode: STATUS_CODE.FORBIDDEN,
    });
  }

  // Check if role has this permission
  const rolePermission = await prisma.role_permissions.findFirst({
    where: {
      role: roleId,
      permission: permissionRecord.id,
    },
  });

  const hasPermission = !!rolePermission;

  logger.info(`User ${userId} (role ${roleId}) permission check for ${permission}: ${hasPermission}`);

  if (!hasPermission) {
    throw new CustomError({
      message: `Insufficient permissions. Required: ${permission}`,
      statusCode: STATUS_CODE.FORBIDDEN,
    });
  }

};