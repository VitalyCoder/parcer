import { TSpecialtyEntity } from '../../1C/entities/specialty.entity';
import { getAllSpecialties } from '../../1C/repositories/specialties.repository';
import { prismaLocal } from '../../app';

export const specialtiesTransaction = async () => {
	console.log(`➡️ Specialties synchronization has started`);

	const specialties = (await getAllSpecialties()) as Array<TSpecialtyEntity>;

	for (const s of specialties) {
		try {
			const candidate = await prismaLocal.specialties.findUnique({
				where: {
					code: s.name,
				},
			});

			if (!candidate) {
				await prismaLocal.specialties.create({
					data: {
						key: s.id,
						code: s.name,
						name: s.name,
					},
				});
			}

			console.log(`✅ Specialties synchronization has completed`);
		} catch (error) {
			console.error(`Ошибка при добавлении specialty с name: ${s.name}`, error);
		}
	}
};
