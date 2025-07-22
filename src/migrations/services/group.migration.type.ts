import { Logger } from '../../common/utils/logger';
import { prismaLocal, prismaRemote } from '../../prisma';
const logger = new Logger();

export const groupMigration = async () => {
	logger.log('Groups migration has started', {
		service: 'group',
	});
	const groups = await prismaLocal.groups.findMany();

	const dummyGroupId = '00000000-0000-0000-0000-000000000000';
	const isExists = await prismaRemote.groups.findUnique({
		where: { id: dummyGroupId },
	});

	if (!isExists) {
		await prismaRemote.groups.create({
			data: {
				id: dummyGroupId,
				key: dummyGroupId,
				degree: dummyGroupId,
				education_form: dummyGroupId,
				course: '',
				direction_code: dummyGroupId,
				direction_name: dummyGroupId,
				program_name: dummyGroupId,
				program_full: dummyGroupId,
				program_link: dummyGroupId,
				department_name: dummyGroupId,
				educationsPlans: {
					connectOrCreate: {
						where: { key: dummyGroupId },
						create: {
							id: dummyGroupId,
							key: dummyGroupId,
							plan_number: dummyGroupId,
						},
					},
				},
				specialties: {
					connectOrCreate: {
						where: { key: dummyGroupId },
						create: {
							id: dummyGroupId,
							key: dummyGroupId,
							code: dummyGroupId,
							name: dummyGroupId,
						},
					},
				},
			},
		});
	}

	for (const g of groups) {
		try {
			await prismaRemote.groups.upsert({
				where: { key: g.key },
				update: {
					key: g.key,
					degree: g.degree,
					education_form: g.educationForm,
					course: g.course,
					direction_code: g.directionCode,
					direction_name: g.directionName,
					program_name: g.programName,
					program_full: g.programFull,
					program_link: g.programLink,
					department_name: g.departmentName,
					educationsPlans: {
						connectOrCreate: {
							where: { key: dummyGroupId },
							create: {
								id: dummyGroupId,
								key: dummyGroupId,
								plan_number: dummyGroupId,
							},
						},
					},
					specialties: {
						connectOrCreate: {
							where: { key: g.specialtyId },
							create: {
								id: g.specialtyId,
								key: g.specialtyId,
								code: g.specialtyId,
								name: g.specialtyId,
							},
						},
					},
				},
				create: {
					id: g.id,
					key: g.key,
					degree: g.degree,
					education_form: g.educationForm,
					course: g.course,
					direction_code: g.directionCode,
					direction_name: g.directionName,
					program_name: g.programName,
					program_full: g.programFull,
					program_link: g.programLink,
					department_name: g.departmentName,
					educationsPlans: {
						connectOrCreate: {
							where: { key: dummyGroupId },
							create: {
								id: dummyGroupId,
								key: dummyGroupId,
								plan_number: dummyGroupId,
							},
						},
					},
					specialties: {
						connectOrCreate: {
							where: { key: g.specialtyId },
							create: {
								id: g.specialtyId,
								key: g.specialtyId,
								code: g.specialtyId,
								name: g.specialtyId,
							},
						},
					},
				},
			});
		} catch (error) {
			logger.error(new Error(`Error upserting group ${g.id}: ${error}`), {
				service: 'group',
			});
		}
	}
	logger.success('Groups migration completed', {
		service: 'group',
	});
};
