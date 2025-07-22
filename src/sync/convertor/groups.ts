import { Logger } from '../../common/utils/logger';
import { Prisma } from '../../generated/prisma/local';
import { prismaLocal } from '../../prisma';
const logger = new Logger();

export const groupsTransaction = async (
	data: Map<string, Prisma.groupsCreateInput>
) => {
	logger.log('Group synchronization has started', { service: 'groups' });
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

	logger.success('Group synchronization completed', { service: 'groups' });
};
