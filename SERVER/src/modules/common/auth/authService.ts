import {getAdminPrisma, getTenantConnection} from '../../../config';
import { comparePassword, generateToken } from '../../../utils';
import CustomError from '../../../utils/CustomError';
import { STATUS_CODE } from '../../../constants';

export const loginService = async ({ email, password }: { email: string; password: string }) => {
	// Extract college identifier from email domain
	// Example: admin@sjit.com -> sjit
	const emailParts = email.split('@');
	if (emailParts.length !== 2) {
		throw new CustomError({ message: 'Invalid email format', statusCode: STATUS_CODE.BAD_REQUEST });
	}

	const domain = emailParts[1]; // e.g., "sjit.com"
	const uniq_string = domain.split('.')[0]; // e.g., "sjit"

	// Get admin database connection
	const adminPrisma = getAdminPrisma();

	// Check if college exists in lms_admin database
	const tenant = await adminPrisma.tenants.findUnique({
		where: { uniq_string },
		select: {
			id: true,
			college_name: true,
			uniq_string: true,
			db_string: true,
			is_active: true,
		},
	});

	if (!tenant) {
		throw new CustomError({ message: 'College not found', statusCode: STATUS_CODE.NOT_FOUND });
	}

	if (!tenant.is_active) {
		throw new CustomError({ message: 'College account is inactive', statusCode: STATUS_CODE.FORBIDDEN });
	}

	// Get tenant database connection from pool
	const tenantPrisma = getTenantConnection(tenant.db_string, tenant.id);

	// Find user in tenant database
	const user = await tenantPrisma.users.findUnique({
		where: { email },
		include: { roles: true },
	});

	if (!user) {
		throw new CustomError({ message: 'Invalid credentials', statusCode: STATUS_CODE.UNAUTHORIZED });
	}

	if (!user.password) {
		throw new CustomError({ message: 'User password not set', statusCode: STATUS_CODE.UNAUTHORIZED });
	}

	const match = await comparePassword({ password, hashPassword: user.password });
	if (!match) {
		throw new CustomError({ message: 'Invalid credentials', statusCode: STATUS_CODE.UNAUTHORIZED });
	}

	// Fetch permissions for the user's role
	if (!user.role_id) {
		throw new CustomError({ message: 'User role not assigned', statusCode: STATUS_CODE.FORBIDDEN });
	}

	const roleId = user.role_id;
	const roleName = user.roles?.role ?? null;

	let permissions: string[] = [];

	if (user.is_super_admin) {
		// Super admin gets all LMS permissions
		const all = await tenantPrisma.permissions.findMany({
			where: { permission: { startsWith: 'LMS' } },
			select: { permission: true },
		});
		permissions = all.map((p: any) => p.permission);
	} else {
		// Regular users get role-based permissions
		const rolePerms = await tenantPrisma.role_permissions.findMany({
			where: {
				role: roleId,
				permissions: { permission: { startsWith: 'LMS' } },
			},
			include: { permissions: true },
		});

		permissions = rolePerms.map((rp: any) => rp.permissions.permission);
	}

	// Generate JWT token with user_id, role_id, and college_id
	const token = generateToken({ 
		userId: user.id, 
		roleId: user.role_id,
		collegeId: tenant.id,
	});

	return {
		token,
		permissions,
		role: roleName
	};
};