import bcrypt from "bcryptjs";

/**
 * Hashes a plain text password using bcrypt.
 * @param password - The plain text password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export const hashPassword = async ({password}: {password: string}): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compares a plain text password with a hashed password.
 * @param password - The plain text password.
 * @param hash - The hashed password.
 * @returns A promise that resolves to true if the passwords match, false otherwise.
 */
export const comparePassword = async ({password, hashPassword}: {password: string, hashPassword: string}): Promise<boolean> => {
  return bcrypt.compare(password, hashPassword);
};