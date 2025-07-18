import { TSpecialtyEntity } from '../1C/entities/specialty.entity';
import { getAllSpecialties } from '../1C/repositories/specialties.repository';
import { prismaLocal } from '../app';
import { employeeToPerson } from './convertor/employeeToPerson';
import { studentsToPerson } from './convertor/studentsToPerson';

export const transactions = async () => {
	console.log(`➡️ Data synchronization has started`);

	const specialties = (await getAllSpecialties()) as Array<TSpecialtyEntity>;
	let specialtiesCount = 0;

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
				specialtiesCount += 1;
			}
		} catch (error) {
			console.error(`Ошибка при добавлении specialty с name: ${s.name}`, error);
		}
	}

	await studentsToPerson();
	await employeeToPerson();

	console.log(`✅ Data synchronization completed`);
};
