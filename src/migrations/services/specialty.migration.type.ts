import { PrismaClient as localClient } from '../../generated/prisma/local';
import { PrismaClient as remoteClient } from '../../generated/prisma/remote';

const prismaLocal = new localClient();
const prismaRemote = new remoteClient();

export const specialtyMigration = async () => {
	const specialties = await prismaLocal.specialties.findMany();
	const candidate = await prismaRemote.specialties.findUnique({
		where: {
			id: '00000000-0000-0000-0000-000000000000',
		},
	});
	if (!candidate) {
		await prismaRemote.specialties.create({
			data: {
				id: '00000000-0000-0000-0000-000000000000',
				key: '00000000-0000-0000-0000-000000000000',
				code: '00000000-0000-0000-0000-000000000000',
				name: '00000000-0000-0000-0000-000000000000',
			},
		});
	}
	if (specialties) {
		await prismaRemote.specialties.createMany({
			data: specialties,
			skipDuplicates: true,
		});
	}
};
