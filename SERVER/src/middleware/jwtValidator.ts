import { Request, Response as ExpressResponse, NextFunction } from 'express';
import { Response } from '../utils';
import { STATUS_CODE } from '../constants';
import { verifyToken } from '../utils/jwtUtil';
import logger from '../config/logger';

/**
 * JWT Validation Middleware
 * Extracts token from Authorization header, verifies it, and attaches decoded payload to req.user
 */
export const validateJWT = (req: Request, res: ExpressResponse, next: NextFunction): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      Response({
        res,
        data: null,
        statusCode: STATUS_CODE.UNAUTHORIZED,
        message: 'No token provided. Authorization header must be in format: Bearer <token>',
      });
      return;
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // Verify token and decode payload
    const decoded = verifyToken(token);

    

    // Attach decoded payload to req.user for use in subsequent middleware/controllers
    req.user = {
      userId: decoded.userId,
      roleId: decoded.roleId,
      collegeId: decoded.collegeId,
      isSuperAdmin: decoded.isSuperAdmin ?? false,
    };

    
    next();
  } catch (error: any) {
    logger.error('JWT validation failed:', error);
    
    Response({
      res,
      data: null,
      statusCode: STATUS_CODE.UNAUTHORIZED,
      message: error.message || 'Invalid or expired token',
    });
  }
};
