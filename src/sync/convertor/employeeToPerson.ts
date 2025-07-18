import { getAllEmployees } from '../../1C/repositories/employees.repository';
import { prismaLocal } from '../../app';
import { separateName } from '../../common/utils/separateName';
import redisClient from '../../redis';

export const employeeToPerson = async () => {
	const employees = await getAllEmployees();
	const addedEmails = new Set<string>();

	const persons = await prismaLocal.persons.findMany({
		select: {
			firstName: true,
			lastName: true,
			middleName: true,
		},
	});

	const fullNames = persons.map(
		p => `${p.lastName} ${p.firstName} ${p.middleName}`
	);

	for (const employee of employees) {
		const personKey = employee['Сотрудник_Key'] as string;
		if (!personKey) continue;

		const email = await redisClient.hGet(personKey, 'email');
		const name = await redisClient.hGet(`person:${personKey}`, 'name');
		const separatedName = separateName(name || '');

		const isNameMatch = name && fullNames.includes(name);
		const existingByEmail = email
			? await prismaLocal.persons.findUnique({ where: { sfeduEmail: email } })
			: null;
		const existingByKey = await prismaLocal.persons.findUnique({
			where: { key: personKey },
		});

		const matchedByName = separatedName
			? await prismaLocal.persons.findFirst({
					where: {
						firstName: separatedName.firstName,
						lastName: separatedName.lastName,
						middleName: separatedName.middleName,
					},
			  })
			: null;

		const existingProfile = await prismaLocal.employeesProfiles.findUnique({
			where: { key: personKey },
		});

		if (existingProfile) {
			// console.warn(`Skipping existing profile for key: ${personKey}`);
			continue;
		}

		await prismaLocal.$transaction(async tx => {
			let person;

			// 1. Уже есть person с таким key
			if (existingByKey) {
				person = existingByKey;
			}

			// 2. Обновляем существующего по email, если он студент
			else if (existingByEmail?.isStudent) {
				person = await tx.persons.update({
					where: { sfeduEmail: email! },
					data: { isEmployee: true },
				});
			}

			// 3. Если совпало имя — обновим найденного по имени
			else if (isNameMatch && matchedByName) {
				person = await tx.persons.update({
					where: { id: matchedByName.id },
					data: { isEmployee: true },
				});
			}

			// 4. Иначе создаём нового
			else {
				person = await tx.persons.create({
					data: {
						key: personKey,
						lastName: separatedName?.lastName || '',
						firstName: separatedName?.firstName || '',
						middleName: separatedName?.middleName || '',
						sfeduEmail: email,
						photoUrl: null,
						isStudent: false,
						isEmployee: true,
					},
				});
			}

			// Создаём профиль сотрудника, только если он ещё не существует
			await tx.employeesProfiles.create({
				data: {
					key: personKey,
					person: {
						connect: { id: person.id },
					},
					academicTitle: '',
					academicDegree: '',
					educationDetails: '',
					generalExperienceStart: new Date('2010-09-01T00:00:00'),
					fieldExperienceYears: 0,
					disciplines: [],
				},
			});
		});

		if (email) addedEmails.add(email);
	}
};
