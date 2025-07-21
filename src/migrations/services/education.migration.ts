import { prismaLocal, prismaRemote } from '../../app';

export const educationMigration = async () => {
	console.log(`➡️ Educations plans migration has started`);
	const educationPlans = await prismaLocal.educationsPlans.findMany();
	const dummyId = '00000000-0000-0000-0000-000000000000';

	const isExists = await prismaRemote.educationsPlans.findUnique({
		where: {
			id: dummyId,
		},
	});
	if (!isExists) {
		await prismaRemote.educationsPlans.create({
			data: {
				id: dummyId,
				key: dummyId,
				plan_number: dummyId,
			},
		});
	}

	for (const ep of educationPlans) {
		await prismaRemote.educationsPlans.upsert({
			where: {
				key: ep.key,
			},
			update: {
				key: ep.key,
				plan_number: dummyId,
			},
			create: {
				id: ep.id,
				key: ep.key,
				plan_number: ep.planNumber,
			},
		});
	}

	console.log(`✅ Educations plans migration completed`);
};
