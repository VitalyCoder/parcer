import { PrismaClient as localClient } from '../../generated/prisma/local';
import { PrismaClient as remoteClient } from '../../generated/prisma/remote';
import { employeeMigration } from './employee.migration';
import { studentMigration } from './student.migration';

const prismaLocal = new localClient();
const prismaRemote = new remoteClient();

export const personMigration = async () => {
	const persons = await prismaLocal.persons.findMany({
		include: {
			studentProfile: true,
			employeeProfile: true,
		},
	});

	for (const person of persons) {
		try {
			const exists = await prismaRemote.persons.findUnique({
				where: { id: person.id },
			});

			if (exists) {
				// console.log(`⚠️ Person with ID ${person.id} already exists. Skipping.`);
				continue;
			}

			await prismaRemote.persons.create({
				data: {
					id: person.id,
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

			// console.log(`✅ Person ${person.id} migrated successfully.`);
		} catch (error) {
			console.error(`❌ Error migrating person ${person.id}:`, error);
		}
	}
};
