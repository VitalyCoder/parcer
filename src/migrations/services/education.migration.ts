import { Logger } from '../../common/utils/logger';
import { prismaLocal, prismaRemote } from '../../prisma';
const logger = new Logger();

export const educationMigration = async () => {
	logger.log('Educations plans migration has started', {
		service: 'education plan',
	});
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

	logger.success('Educations plans migration completed', {
		service: 'education plan',
	});
};
