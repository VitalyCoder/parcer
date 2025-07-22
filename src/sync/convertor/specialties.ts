import { TSpecialtyEntity } from '../../1C/entities/specialty.entity';
import { getAllSpecialties } from '../../1C/repositories/specialties.repository';
import { Logger } from '../../common/utils/logger';
import { prismaLocal } from '../../prisma';
const logger = new Logger();

export const specialtiesTransaction = async () => {
	logger.log('Specialties synchronization has started', {
		service: 'specialties',
	});

	const specialties = (await getAllSpecialties()) as Array<TSpecialtyEntity>;

	for (const s of specialties) {
		try {
			await prismaLocal.specialties.upsert({
				where: {
					code: s.name,
				},
				update: {
					key: s.id,
					name: s.name,
				},
				create: {
					key: s.id,
					code: s.name,
					name: s.name,
				},
			});
		} catch (error) {
			logger.error(
				new Error(`Error syncing specialty with name: ${s.name}: ${error}`),
				{
					service: 'specialties',
				}
			);
		}
	}

	logger.success('Specialties synchronization has completed', {
		service: 'specialties',
	});
};
