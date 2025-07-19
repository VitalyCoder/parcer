import { PrismaClient as localClient } from '../../generated/prisma/local';
import { PrismaClient as remoteClient } from '../../generated/prisma/remote';

const prismaLocal = new localClient();
const prismaRemote = new remoteClient();

export const educationMigration = async () => {
	const dummyId = '00000000-0000-0000-0000-000000000000';

	await prismaRemote.educationsPlans.upsert({
		where: {
			id: dummyId,
		},
		update: {
			key: dummyId,
			plan_number: dummyId,
		},
		create: {
			id: dummyId,
			key: dummyId,
			plan_number: dummyId,
		},
	});
};
