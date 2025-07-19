import { PrismaClient as localClient } from '../../generated/prisma/local';
import { PrismaClient as remoteClient } from '../../generated/prisma/remote';

const prismaLocal = new localClient();
const prismaRemote = new remoteClient();

export const specialtyMigration = async () => {
	const specialties = await prismaLocal.specialties.findMany();

	// Создание фиктивной специальности, если отсутствует
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

	// Обновление или создание каждой специальности
	for (const s of specialties) {
		try {
			await prismaRemote.specialties.upsert({
				where: { id: s.id },
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
			console.error(`❌ Failed to upsert specialty ${s.id}:`, error);
		}
	}
};
