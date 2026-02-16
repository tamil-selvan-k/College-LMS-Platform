import getAdminPrisma from "./adminPrisma";
import logger from "./logger";

/**
 * Connects to the admin database on server startup
 * Tenant databases are connected on-demand via tenantPool
 */
export const connectDB = async () => {
  try {
    const adminPrisma = getAdminPrisma();
    await adminPrisma.$connect();
    logger.info("Admin database connected successfully");
  } catch (err) {
    logger.error("Admin database connection failed:", err);
    process.exit(1);
  }
};