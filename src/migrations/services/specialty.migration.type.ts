import { prismaLocal, prismaRemote } from '../../app';

export const specialtyMigration = async () => {
	console.log(`➡️ Specialties migration has started`);
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
			console.error(`❌ Failed to upsert specialty ${s.id}:`, error);
		}
	}
	console.log(`✅ Specialties migration completed`);
};
