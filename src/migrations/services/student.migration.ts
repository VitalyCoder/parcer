import { Logger } from '../../common/utils/logger';
import { studentsProfiles } from '../../generated/prisma/local';
import { prismaRemote } from '../../prisma';
const logger = new Logger();

export const studentMigration = async (student: studentsProfiles) => {
	const remoteGroup = await prismaRemote.groups.findUnique({
		where: { key: student.groupId },
	});

	if (!remoteGroup) {
		logger.warn(
			`Remote group not found for groupId ${student.groupId}. Skipping student ${student.id}`,
			{
				service: 'student',
			}
		);
		return;
	}

	try {
		await prismaRemote.studentsProfiles.upsert({
			where: { key: student.key },
			update: {
				course: student.course,
				education_form: student.educationForm,
				education_level: student.educationLevel,
				group_internal: student.groupInternal,
				group_official: student.groupOfficial,
				record_book_num: student.recordBookNum,
			},
			create: {
				key: student.key,
				course: student.course,
				education_form: student.educationForm,
				education_level: student.educationLevel,
				group_internal: student.groupInternal,
				group_official: student.groupOfficial,
				record_book_num: student.recordBookNum,

				departments: {
					connect: {
						key: student.departmentId,
					},
				},

				groups: {
					connect: {
						id: remoteGroup.id,
					},
				},

				persons: {
					connect: {
						key: student.key,
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
		logger.error(
			new Error(`Error upserting student profile ${student.id}: ${error}`),
			{
				service: 'student',
			}
		);
	}
};
