import { getAllStudents } from '../../1C/repositories/students.repository';
import { separateName } from '../../common/utils/separateName';
import { Prisma, PrismaClient } from '../../generated/prisma';
import redisClient from '../../redis';

const prisma = new PrismaClient();

function isValidUUID(value: string | null | undefined): value is string {
	return (
		typeof value === 'string' &&
		/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
			value
		)
	);
}

export const studentsToPerson = async () => {
	const students = await getAllStudents();
	let count: number = 0;
	const addedEmails = new Set<string>();
	const groups: Array<Prisma.groupsCreateInput> = [
		{
			degree: '',
			educationForm: '',
			course: 0,
			specialtyId: '',
			directionCode: '',
			directionName: '',
			programName: '',
			programFull: '',
			programLink: '',
			departmentName: '',
			plan: {
				create: undefined,
				connectOrCreate: undefined,
				connect: undefined,
			},
		},
	];

	for (const person of students) {
		const personKey = person['ФизическоеЛицо_Key'];
		const name = await redisClient.hGet(`person:${personKey}`, 'name');
		const email = await redisClient.hGet(`person:${personKey}`, 'email');
		const specialtyId = person['Специальность_Key'];
		const departmentId = person['Факультет_Key'];
		const groupId = await redisClient.get(`group:${person['Группа_Key']}`);

		if (!email || addedEmails.has(email)) continue;

		const existingPerson = await prisma.persons.findFirst({
			where: { sfeduEmail: email },
		});

		if (!existingPerson) {
			const separatedName = separateName(name as string);
			try {
				await prisma.$transaction(async () => {
					const newPerson = await prisma.persons.create({
						data: {
							lastName: separatedName?.lastName || '',
							firstName: separatedName?.firstName || '',
							middleName: separatedName?.middleName,
							sfeduEmail: email,
							photoUrl: null,
							isStudent: true,
							isEmployee: false,
						},
					});

					await prisma.studentsProfiles.create({
						data: {
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
								(await redisClient.get(`group:${person['Группа_Key']}`)) ||
								'0030d2d0-babe-448a-941b-5a78d3f3a9c4',
							groupOfficial:
								(await redisClient.get(`group:${person['Группа_Key']}`)) ||
								'0030d2d0-babe-448a-941b-5a78d3f3a9c4',
							recordBookNum:
								(await redisClient.get(
									`creditBook:${person['ЗачетнаяКнига_Key']}`
								)) || '0030d2d0-babe-448a-941b-5a78d3f3a9c4',
							specialtyId: '0030d2d0-babe-448a-941b-5a78d3f3a9c4',
							departmentId: '0030d2d0-babe-448a-941b-5a78d3f3a9c4',
							groupId: '0030d2d0-babe-448a-941b-5a78d3f3a9c4',
						},
					});
				});
				addedEmails.add(email);
				count += 1;
			} catch (error) {
				console.error(`Ошибка при создании пользователя ${email}:`, error);
			}
		}
	}
};
