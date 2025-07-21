import { prismaLocal, prismaRemote } from '../../app';
import { employeeMigration } from './employee.migration';
import { studentMigration } from './student.migration';

export const personMigration = async () => {
	console.log(`➡️ Persons migration has started`);
	const persons = await prismaLocal.persons.findMany({
		include: {
			studentProfile: true,
			employeeProfile: true,
		},
	});

	for (const person of persons) {
		try {
			await prismaRemote.persons.upsert({
				where: { key: person.key },
				update: {
					...(person.sfeduEmail && { sfedu_email: person.sfeduEmail }),
					photo_url: person.photoUrl,
					last_name: person.lastName,
					first_name: person.firstName,
					middle_name: person.middleName,
					is_student: person.isStudent,
					is_employee: person.isEmployee,
				},
				create: {
					id: person.id,
					key: person.key,
					sfedu_email: person.sfeduEmail,
					photo_url: person.photoUrl,
					last_name: person.lastName,
					first_name: person.firstName,
					middle_name: person.middleName,
					is_student: person.isStudent,
					is_employee: person.isEmployee,
				},
			});

			if (person.studentProfile) {
				await studentMigration(person.studentProfile);
			}
			if (person.employeeProfile) {
				await employeeMigration(person.employeeProfile);
			}
		} catch (error) {
			console.error(`❌ Error during migration of person ${person.id}:`, error);
		}
	}

	console.log(`✅ Persons migration completed`);
};
