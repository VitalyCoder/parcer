import { getAllStudents } from '../../1C/repositories/students.repository';
import { prismaLocal } from '../../app';
import { separateName } from '../../common/utils/separateName';
import { Prisma } from '../../generated/prisma/local';
import redisClient from '../../redis';
import { groupsTransaction } from './groups';

export const studentsToPerson = async () => {
	console.log(`➡️ Student synchronization has started`);

	const students = await getAllStudents();
	const addedEmails = new Set<string>();
	const groupsMap = new Map<string, Prisma.groupsCreateInput>();

	for (const person of students) {
		const personKey = person['ФизическоеЛицо_Key'];
		const name = await redisClient.hGet(`person:${personKey}`, 'name');
		const email = await redisClient.hGet(`person:${personKey}`, 'email');
		const specialtyId = person['Специальность_Key'];
		const departmentId = person['Факультет_Key'];
		const groupKey = person['Группа_Key'];
		const groupId = await redisClient.get(`group:${groupKey}`);

		if (!email || addedEmails.has(email)) continue;

		const existingPerson = await prismaLocal.persons.findFirst({
			where: { sfeduEmail: email },
		});

		if (!existingPerson) {
			const separatedName = separateName(name as string);
			try {
				await prismaLocal.$transaction(async () => {
					const newPerson = await prismaLocal.persons.create({
						data: {
							key: personKey,
							lastName: separatedName?.lastName || '',
							firstName: separatedName?.firstName || '',
							middleName: separatedName?.middleName,
							sfeduEmail: email,
							photoUrl: null,
							isStudent: true,
							isEmployee: false,
						},
					});

					await prismaLocal.studentsProfiles.create({
						data: {
							key: personKey,
							person: {
								connect: {
									id: newPerson.id,
								},
							},
							course:
								Number(await redisClient.get(`course:${person['Курс_Key']}`)) ||
								0,
							educationForm: (await redisClient.get(
								`educationForm:${person['ФормаОбучения_Key']}`
							)) as string,
							educationLevel: '',
							groupInternal:
								(await redisClient.get(`group:${groupKey}`)) ||
								'0030d2d0-babe-448a-941b-5a78d3f3a9c4',
							groupOfficial:
								(await redisClient.get(`group:${groupKey}`)) ||
								'0030d2d0-babe-448a-941b-5a78d3f3a9c4',
							recordBookNum:
								(await redisClient.get(
									`creditBook:${person['ЗачетнаяКнига_Key']}`
								)) || '0030d2d0-babe-448a-941b-5a78d3f3a9c4',
							specialtyId: specialtyId,
							departmentId: departmentId,
							groupId: groupId ?? '00000000-0000-0000-0000-000000000000',
						},
					});
				});

				addedEmails.add(email);

				if (!groupId) continue;

				if (!groupsMap.has(groupId)) {
					groupsMap.set(groupId, {
						key: groupId,
						degree: (await redisClient.get(
							`educationForm:${person['ФормаОбучения_Key']}`
						)) as string,
						educationForm: (await redisClient.get(
							`educationForm:${person['ФормаОбучения_Key']}`
						)) as string,
						course:
							Number(await redisClient.get(`course:${person['Курс_Key']}`)) ||
							0,
						specialtyId: specialtyId,
						directionCode: '',
						directionName: '',
						programName: '',
						programFull: '',
						programLink: '',
						departmentName: '',
						planId: (await redisClient.get(
							`curriculum:${person['УчебныйПлан_Key']}`
						)) as string,
					});
				}
			} catch (error) {
				console.error(`Ошибка при создании пользователя ${email}:`, error);
			}
		}
	}
	console.log(`✅ Student synchronization completed`);

	await groupsTransaction(groupsMap);
};
