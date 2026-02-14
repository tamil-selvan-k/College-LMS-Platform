import prisma from "./db";

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("DB Connected successfully via Prisma");
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
};

export default prisma;