import { Request } from 'express';
import { PrismaClient as TenantPrismaClient } from '@prisma/tenant-client';

// User authentication and tenant context types for Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        roleId: number;
        collegeId: number;
        isSuperAdmin: boolean;
      };
      tenantPrisma?: TenantPrismaClient;
      tenant?: {
        id: number;
        college_name: string;
        uniq_string: string;
        db_string: string;
      };
    }
  }
}

export {};
