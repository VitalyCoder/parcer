import { studentsProfiles } from '../../generated/prisma/local';
import { PrismaClient as remoteClient } from '../../generated/prisma/remote';

const prismaRemote = new remoteClient();

export const studentMigration = async (student: studentsProfiles) => {
	const remoteGroup = await prismaRemote.groups.findUnique({
		where: { key: student.groupId },
	});

	if (!remoteGroup) {
		console.warn(
			`⚠️ Remote group not found for groupId ${student.groupId}. Skipping student ${student.id}`
		);
		return;
	}

	try {
		await prismaRemote.studentsProfiles.upsert({
			where: { id: student.id },
			update: {
				course: student.course,
				education_form: student.educationForm,
				education_level: student.educationLevel,
				group_internal: student.groupInternal,
				group_official: student.groupOfficial,
				record_book_num: student.recordBookNum,
			},
			create: {
				course: student.course,
				education_form: student.educationForm,
				education_level: student.educationLevel,
				group_internal: student.groupInternal,
				group_official: student.groupOfficial,
				record_book_num: student.recordBookNum,

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
	} catch (error) {
		console.error(`❌ Error upserting student profile ${student.id}:`, error);
	}
};
