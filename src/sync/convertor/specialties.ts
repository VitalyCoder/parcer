import { TSpecialtyEntity } from '../../1C/entities/specialty.entity';
import { getAllSpecialties } from '../../1C/repositories/specialties.repository';
import { prismaLocal } from '../../app';

export const specialtiesTransaction = async () => {
	console.log(`➡️ Specialties synchronization has started`);

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
			console.error(`❌ Error syncing specialty with name: ${s.name}`, error);
		}
	}

	console.log(`✅ Specialties synchronization has completed`);
};
