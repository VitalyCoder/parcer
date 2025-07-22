import { getAllEmployees } from '../../1C/repositories/employees.repository';
import { Logger } from '../../common/utils/logger';
import { separateName } from '../../common/utils/separateName';
import { prismaLocal } from '../../prisma';
import { Prisma } from '../../generated/prisma/local';
import { employmentsTransaction } from "c:/Files/parcer/src/sync/convertor/employment"
import redisClient from '../../redis';
const logger = new Logger();

export const employeeToPerson = async () => {
	logger.log('Employee synchronization has started', { service: 'employees' });

	const employees = await getAllEmployees();
	const addedEmails = new Set<string>();
	const employmentsMap = new Map<string, Prisma.employmentsCreateInput>();
	

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
		const positionKey = employee['Должность_Key'] as string;
		const position = await redisClient.get(`position:${positionKey}`);
		const employmentType = employee['ВидЗанятости'] as string;
		const rateKey = employee['Ставка_Key'] as string;
		const rates = await redisClient.get(`rate:${rateKey}`);
		const rate = rates?.split(' ')[0];
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
		const employe = await prismaLocal.employeesProfiles.findUnique({
			where: {
				key: personKey,
			}
		});
		const department = await prismaLocal.departments.findMany({});

		const matchedByName = separatedName
			? await prismaLocal.persons.findFirst({
					where: {
						firstName: separatedName.firstName,
						lastName: separatedName.lastName,
						middleName: separatedName.middleName,
					},
			  })
			: null;

		await prismaLocal.$transaction(async tx => {
			let person = existingByKey;

			if (!person) {
				if (existingByEmail?.isStudent) {
					person = await tx.persons.update({
						where: { sfeduEmail: email! },
						data: {
							isEmployee: true,
							key: personKey,
						},
					});
				} else if (isNameMatch && matchedByName) {
					person = await tx.persons.update({
						where: { id: matchedByName.id },
						data: {
							isEmployee: true,
							key: personKey,
							sfeduEmail: email || matchedByName.sfeduEmail,
						},
					});
				} else {
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
			}

			await tx.employeesProfiles.upsert({
				where: { key: personKey },
				update: {
					id: person.id,
				},
				create: {
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

			if (!employmentsMap.has(personKey)) {
				employmentsMap.set(personKey, {
					key: personKey, // сотрудника
					employeeProfileId: employe?.id || "",
					position: position || "",
					employmentType:  employmentType,
					departmentId : department[0]?.id || " ", // подразделение
					rate: Number(rate?.replace(',', ".")|| " "),
					
				});
			}
		});

		if (email) addedEmails.add(email);
	}

	logger.success('Employee synchronization has completed', {
		service: 'employees',
	});
	await employmentsTransaction(employmentsMap);
};
