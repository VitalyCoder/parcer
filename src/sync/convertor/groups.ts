import { prismaLocal } from '../../app';
import { Prisma } from '../../generated/prisma/local';

export const groupsTransaction = async (
	data: Map<string, Prisma.groupsCreateInput>
) => {
	console.log(`➡️ Group synchronization has started`);
	const uniqueGroups = Array.from(data.values());

	await prismaLocal.groups.createMany({
		data: uniqueGroups,
		skipDuplicates: true,
	});

	console.log(`✅ Group synchronization completed`);
};
