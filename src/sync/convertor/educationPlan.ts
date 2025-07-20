import { prismaLocal } from '../../app';
import { Prisma } from '../../generated/prisma/local';

export const educationPlanTransaction = async (
	data: Map<string, Prisma.educationsPlansCreateInput>
) => {
	console.log(`➡️ Education plan synchronization has started`);
	const educationPlan = Array.from(data.values());

	await prismaLocal.educationsPlans.createMany({
		data: educationPlan,
		skipDuplicates: true,
	});

	console.log(`✅ Education plan synchronization completed`);
};
