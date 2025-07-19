import { Prisma } from 'src/generated/prisma/local';
import { prismaLocal } from '../../app';

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
