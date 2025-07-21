import { prismaLocal } from '../../app';
import { Prisma } from '../../generated/prisma/local';

export const departmentTransaction = async (
	data: Map<string, Prisma.departmentsCreateInput>
) => {
	console.log(`➡️ Departments synchronization has started`);
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

	console.log(`✅ Departments synchronization completed`);
};
