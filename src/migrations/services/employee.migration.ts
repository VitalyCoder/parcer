import { employeesProfiles } from '../../generated/prisma/local';
import { prismaRemote } from '../../prisma';

export const employeeMigration = async (employee: employeesProfiles) => {
	await prismaRemote.employeesProfiles.upsert({
		where: { key: employee.key },
		update: {
			general_experience_start: employee.generalExperienceStart,
			field_experience_years: employee.fieldExperienceYears,
		},
		create: {
			key: employee.key,
			general_experience_start: employee.generalExperienceStart,
			field_experience_years: employee.fieldExperienceYears,
			persons: {
				connect: {
					key: employee.key,
				},
			},
		},
	});
};
