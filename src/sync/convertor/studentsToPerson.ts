import { getAllStudents } from '../../1C/repositories/students.repository';
import { Logger } from '../../common/utils/logger';
import { separateName } from '../../common/utils/separateName';
import { Prisma } from '../../generated/prisma/local';
import { prismaLocal } from '../../prisma';
import redisClient from '../../redis';
import { departmentTransaction } from './department';
import { educationPlanTransaction } from './educationPlan';
import { groupsTransaction } from './groups';

const logger = new Logger();

export const studentsToPerson = async () => {
	logger.log('Student synchronization has started', { service: 'students' });

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

		const educationForm = (await redisClient.get(
			`educationForm:${person['ФормаОбучения_Key']}`
		)) as string;

		const recordBookNum = (await redisClient.get(
			`creditBook:${person['ЗачетнаяКнига_Key']}`
		)) as string;

		const presentation = person['ПредставлениеЗачетнойКниги'].split(",") as string;
		const group = presentation[3].split("-");
		//const code = group[1].split('.')
		//const directionCode = code[0] + '.' + code[1] + '.' + code[2];
		
		
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
				abbreviation: presentation[1]
			});
		}

		const separatedName = separateName(name as string);

		try {
			await prismaLocal.$transaction(async tx => {
				const newPerson = await tx.persons.upsert({
					where: { sfeduEmail: email },
					update: {
						firstName: separatedName?.firstName || '',
						lastName: separatedName?.lastName || '',
						middleName: separatedName?.middleName,
						isStudent: true,
					},
					create: {
						key: personKey,
						firstName: separatedName?.firstName || '',
						lastName: separatedName?.lastName || '',
						middleName: separatedName?.middleName,
						sfeduEmail: email,
						photoUrl: null,
						isStudent: true,
						isEmployee: false,
					},
				});

				await tx.studentsProfiles.upsert({
					where: { key: personKey },
					update: {
						course: course || '',
						educationForm,
						groupInternal: groupId || '',
						groupOfficial: groupId || '',
						recordBookNum,
						specialtyId,
						departmentId,
						groupId: groupId ?? '00000000-0000-0000-0000-000000000000',
					},
					create: {
						key: personKey,
						person: { connect: { id: newPerson.id } },
						course: course || '',
						educationForm,
						educationLevel: '',
						groupInternal: groupId || '',
						groupOfficial: groupId || '',
						recordBookNum,
						specialtyId,
						departmentId,
						groupId: groupId ?? '00000000-0000-0000-0000-000000000000',
					},
				});
			});

			addedEmails.add(email);

			if (!groupKey) continue;

			if (!groupsMap.has(groupKey)) {
				groupsMap.set(groupKey, {
					key: groupKey,
					degree: educationForm,
					educationForm,
					course: course || '',
					specialtyId: specialtyId,
					directionCode: "",
					directionName: '',
					programName: '',
					programFull: '',
					programLink: '',
					departmentName: department,
					planId: educationPlan,
				});
			}
		} catch (error) {
			logger.error(
				new Error(`Error when creating/updating a user ${email}: ${error}`),
				{ service: 'students' }
			);
		}
	}

	logger.success('Student synchronization completed', { service: 'students' });

	await groupsTransaction(groupsMap);
	await educationPlanTransaction(educationPlanMap);
	await departmentTransaction(departmentsMap);
};
