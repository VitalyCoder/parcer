import { prismaLocal } from '../../app';
import { Prisma } from '../../generated/prisma/local';

export const groupsTransaction = async (
	data: Map<string, Prisma.groupsCreateInput>
) => {
	console.log(`➡️ Group synchronization has started`);
	const uniqueGroups = Array.from(data.entries());

	for (const [key, group] of uniqueGroups) {
		await prismaLocal.groups.upsert({
			where: {
				key,
			},
			update: group,
			create: { ...group, key },
		});
	}

	console.log(`✅ Group synchronization completed`);
};
