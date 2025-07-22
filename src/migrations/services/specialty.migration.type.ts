import { Logger } from '../../common/utils/logger';
import { prismaLocal, prismaRemote } from '../../prisma';
const logger = new Logger();

export const specialtyMigration = async () => {
	logger.log('Specialties migration has started', {
		service: 'specialty',
	});
	const specialties = await prismaLocal.specialties.findMany();

	const dummyId = '00000000-0000-0000-0000-000000000000';
	const candidate = await prismaRemote.specialties.findUnique({
		where: { id: dummyId },
	});
	if (!candidate) {
		await prismaRemote.specialties.create({
			data: {
				id: dummyId,
				key: dummyId,
				code: dummyId,
				name: dummyId,
			},
		});
	}

	for (const s of specialties) {
		try {
			await prismaRemote.specialties.upsert({
				where: { key: s.key },
				update: {
					key: s.key,
					code: s.code,
					name: s.name,
				},
				create: {
					id: s.id,
					key: s.key,
					code: s.code,
					name: s.name,
				},
			});
		} catch (error) {
			logger.error(new Error(`Failed to upsert specialty ${s.id}: ${error}`), {
				service: 'specialty',
			});
		}
	}
	logger.success('Specialties migration completed', {
		service: 'specialty',
	});
};
