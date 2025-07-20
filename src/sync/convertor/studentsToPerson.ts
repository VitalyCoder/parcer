import { getAllStudents } from '../../1C/repositories/students.repository';
import { prismaLocal } from '../../app';
import { separateName } from '../../common/utils/separateName';
import { Prisma } from '../../generated/prisma/local';
import redisClient from '../../redis';
import { departmentTransaction } from './department';
import { educationPlanTransaction } from './educationPlan';
import { groupsTransaction } from './groups';

export const studentsToPerson = async () => {
	console.log(`➡️ Student synchronization has started`);

	const students = await getAllStudents();
	const addedEmails = new Set<string>();
	const groupsMap = new Map<string, Prisma.groupsCreateInput>();
	const educationPlanMap = new Map<string, Prisma.educationsPlansCreateInput>();
	const departmentsMap = new Map<string, Prisma.departmentsCreateInput>();

	for (const person of students) {
		const personKey = person['ФизическоеЛицо_Key'];
		const name = await redisClient.hGet(`person:${personKey}`, 'name');
		const email = await redisClient.hGet(`person:${personKey}`, 'email');
		const specialtyId = person['Специальность_Key'];
		const departmentId = person['Факультет_Key'];
		const groupKey = person['Группа_Key'];
		const groupId = await redisClient.get(`group:${groupKey}`);
		const educationPlanKey = person['УчебныйПлан_Key'];
		const educationPlan = (await redisClient.get(
			`curriculum:${educationPlanKey}`
		)) as string;
		const departmentKey = person['Факультет_Key'];
		const department = (await redisClient.get(
			`unit:${departmentKey}`
		)) as string;
		const courseKey = person['Курс_Key'];
		const course = await redisClient.get(`course:${courseKey}`);

		if (!email || addedEmails.has(email)) continue;

		const existingPerson = await prismaLocal.persons.findUnique({
			where: { sfeduEmail: email },
		});

		if (!educationPlanMap.has(educationPlanKey)) {
			educationPlanMap.set(educationPlanKey, {
				key: educationPlanKey,
				planNumber: educationPlan,
			});
		}

		if (!departmentsMap.has(departmentKey)) {
			departmentsMap.set(departmentKey, {
				key: departmentKey,
				name: department,
			});
		}

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
							course: course || '',
							educationForm:
								(await redisClient.get(
									`educationForm:${person['ФормаОбучения_Key']}`
								)) || '',
							educationLevel: '',
							groupInternal: (await redisClient.get(`group:${groupKey}`)) || '',
							groupOfficial: (await redisClient.get(`group:${groupKey}`)) || '',
							recordBookNum:
								(await redisClient.get(
									`creditBook:${person['ЗачетнаяКнига_Key']}`
								)) || '',
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
						course: course || '',
						specialtyId: specialtyId,
						directionCode: '',
						directionName: '',
						programName: '',
						programFull: '',
						programLink: '', // данные будут позже
						departmentName: department,
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
	await educationPlanTransaction(educationPlanMap);
	await departmentTransaction(departmentsMap);
};
