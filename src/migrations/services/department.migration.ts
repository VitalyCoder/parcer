import { Logger } from '../../common/utils/logger';
import { prismaLocal, prismaRemote } from '../../prisma';
const logger = new Logger();

export const departmentMigration = async () => {
	logger.log('Departments migration has started', {
		service: 'department',
	});
	const departments = await prismaLocal.departments.findMany();
	const dummyId = '00000000-0000-0000-0000-000000000000';

	const isExists = await prismaRemote.departments.findUnique({
		where: {
			id: dummyId,
		},
	});
	if (!isExists) {
		await prismaRemote.departments.create({
			data: {
				id: dummyId,
				key: dummyId,
				name: dummyId,
				abbreviation: dummyId,
				number: 0,
			},
		});
	}

	for (const d of departments) {
		await prismaRemote.departments.upsert({
			where: {
				key: d.key,
			},
			update: {
				key: d.key,
				name: d.name,
				abbreviation: d.abbreviation,
				number: d.number,
			},
			create: {
				id: d.id,
				key: d.key,
				name: d.name,
				abbreviation: d.abbreviation,
				number: d.number,
			},
		});
	}
	logger.success('Departments migration completed', {
		service: 'department',
	});
};
