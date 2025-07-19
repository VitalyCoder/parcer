import { PrismaClient as localClient } from '../../generated/prisma/local';
import { PrismaClient as remoteClient } from '../../generated/prisma/remote';

const prismaLocal = new localClient();
const prismaRemote = new remoteClient();

export const groupMigration = async () => {
	const groups = await prismaLocal.groups.findMany();

	// Создаем фиктивную группу, если её нет
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
				course: 0,
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

	// Миграция настоящих групп
	for (const g of groups) {
		try {
			await prismaRemote.groups.upsert({
				where: { id: g.id },
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
			console.log(`✅ Group ${g.id} upserted successfully`);
		} catch (error) {
			console.error(`❌ Error upserting group ${g.id}:`, error);
		}
	}
};
