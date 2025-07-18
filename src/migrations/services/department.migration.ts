import { PrismaClient as localClient } from '../../generated/prisma/local';
import { PrismaClient as remoteClient } from '../../generated/prisma/remote';

const prismaLocal = new localClient();
const prismaRemote = new remoteClient();

export const departmentMigration = async () => {
	const isExists = await prismaRemote.departments.findUnique({
		where: {
			id: '00000000-0000-0000-0000-000000000000',
		},
	});

	if (!isExists) {
		await prismaRemote.departments.create({
			data: {
				id: '00000000-0000-0000-0000-000000000000',
				key: '00000000-0000-0000-0000-000000000000',
				name: '00000000-0000-0000-0000-000000000000',
				abbreviation: '00000000-0000-0000-0000-000000000000',
				number: 0,
			},
		});
	}
};
