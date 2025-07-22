import { Logger } from '../../common/utils/logger';
import { Prisma } from '../../generated/prisma/local';
import { prismaLocal } from '../../prisma';
const logger = new Logger();

export const departmentTransaction = async (
	data: Map<string, Prisma.departmentsCreateInput>
) => {
	logger.log('Departments synchronization has started', {
		service: 'department',
	});
	const departments = Array.from(data.values());

	for (const department of departments) {
		await prismaLocal.departments.upsert({
			where: {
				key: department.key,
			},
			update: department,
			create: department,
		});
	}

	logger.success('Departments synchronization completed', {
		service: 'department',
	});
};
