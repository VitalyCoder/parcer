import { employeesProfiles } from '../../generated/prisma/local';
import { PrismaClient as remoteClient } from '../../generated/prisma/remote';

const prismaRemote = new remoteClient();

export const employeeMigration = async (employee: employeesProfiles) => {
	await prismaRemote.employeesProfiles.upsert({
		where: { id: employee.id },
		update: {
			general_experience_start: employee.generalExperienceStart,
			field_experience_years: employee.fieldExperienceYears,
		},
		create: {
			general_experience_start: employee.generalExperienceStart,
			field_experience_years: employee.fieldExperienceYears,
			persons: {
				connect: {
					id: employee.id,
				},
			},
		},
	});
};
