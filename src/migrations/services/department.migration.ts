import { PrismaClient as localClient } from '../../generated/prisma/local';
import { PrismaClient as remoteClient } from '../../generated/prisma/remote';

const prismaLocal = new localClient();
const prismaRemote = new remoteClient();

export const departmentMigration = async () => {
	const dummyId = '00000000-0000-0000-0000-000000000000';

	await prismaRemote.departments.upsert({
		where: {
			id: dummyId,
		},
		update: {
			key: dummyId,
			name: dummyId,
			abbreviation: dummyId,
			number: 0,
		},
		create: {
			id: dummyId,
			key: dummyId,
			name: dummyId,
			abbreviation: dummyId,
			number: 0,
		},
	});
};
