import { TSpecialtyEntity } from '../1C/entities/specialty.entity';
import { getAllSpecialties } from '../1C/repositories/specialties.repository';
import { PrismaClient } from '../generated/prisma';
import { employeeToPerson } from './convertor/employeeToPerson';
import { studentsToPerson } from './convertor/studentsToPerson';

const prisma = new PrismaClient();

export const transactions = async () => {
	const specialties = (await getAllSpecialties()) as Array<TSpecialtyEntity>;
	let specialtiesCount = 0;

	for (const s of specialties) {
		try {
			const candidate = await prisma.specialties.findUnique({
				where: {
					code: s.name,
				},
			});

			if (!candidate) {
				await prisma.specialties.create({
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

	console.log(
		`Специальности синхронизированы, добавлено ${specialtiesCount} записей`
	);

	await studentsToPerson();
	await employeeToPerson();
};
