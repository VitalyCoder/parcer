import { getAllGroups } from '../1C/repositories/groups.repository';
import { getAllSpecialties } from '../1C/repositories/specialties.repository';
import { getAllStudents } from '../1C/repositories/students.repository';
import { PrismaClient } from '../generated/prisma';
import { studentsToPerson } from './convertor/studentsToPerson';

const prisma = new PrismaClient();

export const transactions = async () => {
	const students = await getAllStudents();
	const specialties = (await getAllSpecialties()) as Array<Record<string, any>>;
	const groups = (await getAllGroups()) as Array<Record<string, any>>;
	const addedEmails = new Set<string>();
	let specialtiesCount: number = 0;
	let count = 0;

	for (const s in specialties) {
		const candidate = await prisma.specialties.findUnique({
			where: {
				code: s,
			},
		});
		if (candidate) continue;
		await prisma.specialties.create({
			data: {
				code: s,
				name: '',
			},
		});
		specialtiesCount += 1;
	}

	console.log(
		`Специальности синхронизорованы, добавлено ${specialtiesCount} записей`
	);

	for (const g in groups) {
		// console.log('Group' + g);
		// await prisma.groups.create({
		// 	data: {
		// 		degree: '',
		// 		educationForm: '',
		// 		course: 0,
		// 		planId: '',
		// 		specialtyId: '',
		// 		directionCode: '',
		// 		directionName: '',
		// 		programName: '',
		// 		programFull: '',
		// 		programLink: '',
		// 		departmentName: '',
		// 	},
		// });
	}
	await studentsToPerson();

	// for (const person of students) {
	// 	const personKey = person['ФизическоеЛицо_Key'];
	// 	const name = await redisClient.hGet(`person:${personKey}`, 'name');
	// 	const email = await redisClient.hGet(`person:${personKey}`, 'email');

	// 	if (!email || addedEmails.has(email)) continue;

	// 	const existingPerson = await prisma.persons.findFirst({
	// 		where: { sfeduEmail: email },
	// 	});

	// 	if (!existingPerson) {
	// 		const separatedName = separateName(name as string);
	// 		try {
	// 			await prisma.persons.create({
	// 				data: {
	// 					id: uuidv4(), // Генерируем новый UUID для person
	// 					lastName: separatedName?.lastName || '',
	// 					firstName: separatedName?.firstName || '',
	// 					middleName: separatedName?.middleName,
	// 					sfeduEmail: email,
	// 					photoUrl: null,
	// 					isStudent: true,
	// 					isEmployee: false,
	// 					studentProfile: {
	// 						create: {
	// 							// id: uuidv4(), // Генерируем новый UUID для studentProfile
	// 							course:
	// 								Number(
	// 									await redisClient.get(`course:${person['Курс_Key']}`)
	// 								) || 0,
	// 							educationForm: (await redisClient.get(
	// 								`educationForm:${person['ФормаОбучения_Key']}`
	// 							)) as string,
	// 							educationLevel: '',
	// 							groupInternal: (await redisClient.get(
	// 								`group:${person['Группа_Key']}`
	// 							)) as string,
	// 							groupOfficial: (await redisClient.get(
	// 								`group:${person['Группа_Key']}`
	// 							)) as string,
	// 							recordBookNum: (await redisClient.get(
	// 								`creditBook:${person['ЗачетнаяКнига_Key']}`
	// 							)) as string,
	// 							specialty: {
	// 								connectOrCreate: {
	// 									where: {
	// 										id: uuidv4(), // Замените на валидный UUID или сгенерируйте новый
	// 									},
	// 									create: {
	// 										id: uuidv4(),
	// 										code: '',
	// 										name: '',
	// 									},
	// 								},
	// 							},
	// 							department: {
	// 								connectOrCreate: {
	// 									where: {
	// 										id: uuidv4(), // Замените на валидный UUID или сгенерируйте новый
	// 									},
	// 									create: {
	// 										id: uuidv4(),
	// 										number: 0,
	// 										name: '',
	// 										abbreviation: '',
	// 									},
	// 								},
	// 							},
	// 							group: {
	// 								connectOrCreate: {
	// 									where: {
	// 										id: uuidv4(), // Замените на валидный UUID или сгенерируйте новый
	// 									},
	// 									create: {
	// 										id: uuidv4(),
	// 										degree: '',
	// 										educationForm: '',
	// 										course: 0,
	// 										planId: '',
	// 										specialtyId: '',
	// 										directionCode: '',
	// 										directionName: '',
	// 										programName: '',
	// 										programFull: '',
	// 										programLink: '',
	// 										departmentName: '',
	// 									},
	// 								},
	// 							},
	// 						},
	// 					},
	// 					// Убрал создание employeeProfile для студентов
	// 				},
	// 			});
	// 			addedEmails.add(email);
	// 			count++;
	// 		} catch (error) {
	// 			console.error(`Ошибка при создании пользователя ${email}:`, error);
	// 		}
	// 	}
	// }

	console.log(`Добавлено ${count} записей`);
};
