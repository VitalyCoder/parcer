import { Logger } from '../../common/utils/logger';
import { Prisma } from '../../generated/prisma/local';
import { prismaLocal } from '../../prisma';
const logger = new Logger();

export const educationPlanTransaction = async (
	data: Map<string, Prisma.educationsPlansCreateInput>
) => {
	logger.log('Education plan synchronization has started', {
		service: 'education plan',
	});
	const educationPlans = Array.from(data.values());

	for (const plan of educationPlans) {
		await prismaLocal.educationsPlans.upsert({
			where: {
				key: plan.key,
			},
			update: plan,
			create: plan,
		});
	}

	logger.success('Education plan synchronization completed', {
		service: 'education plan',
	});
};
