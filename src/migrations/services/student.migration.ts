import { studentsProfiles } from '../../generated/prisma/local';
import { PrismaClient as remoteClient } from '../../generated/prisma/remote';

const prismaRemote = new remoteClient();

export const studentMigration = async (student: studentsProfiles) => {
	// console.log(`➡️ Migrating student ${student.id}`);

	const remoteGroup = await prismaRemote.groups.findUnique({
		where: { key: student.groupId },
	});

	if (remoteGroup) {
		// Создаем профиль студента
		await prismaRemote.studentsProfiles.create({
			data: {
				course: student.course,
				education_form: student.educationForm,
				education_level: student.educationLevel,
				group_internal: student.groupInternal,
				group_official: student.groupOfficial,
				record_book_num: student.recordBookNum,

				// Подключаем фиктивный департамент
				departments: {
					connect: {
						key: '00000000-0000-0000-0000-000000000000',
					},
				},

				groups: {
					connect: {
						id: remoteGroup.id,
					},
				},

				persons: {
					connect: {
						id: student.id,
					},
				},

				specialties: {
					connect: {
						key: student.specialtyId,
					},
				},
			},
		});
	}

	// console.log(`✅ Student profile for ${student.id} migrated`);
};
