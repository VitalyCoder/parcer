import { prismaLocal } from '../../app';
import { Prisma } from '../../generated/prisma/local';

export const departmentTransaction = async (
	data: Map<string, Prisma.departmentsCreateInput>
) => {
	console.log(`➡️ Departments synchronization has started`);
	const departments = Array.from(data.values());

	await prismaLocal.departments.createMany({
		data: departments,
		skipDuplicates: true,
	});

	console.log(`✅ Departments synchronization completed`);
};
