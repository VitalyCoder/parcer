import { prismaLocal } from '../../app';
import { Prisma } from '../../generated/prisma/local';

export const educationPlanTransaction = async (
	data: Map<string, Prisma.educationsPlansCreateInput>
) => {
	console.log(`➡️ Education plan synchronization has started`);
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

	console.log(`✅ Education plan synchronization completed`);
};
