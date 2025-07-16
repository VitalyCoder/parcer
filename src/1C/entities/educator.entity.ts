export type TEducatorEntity = {
	id: string; // ID
	employeeId: string; // ID в 1C
	name: string; // фио
	email?: string; // sfedu-почта
	position: number; // должность
	typeOfEmployment: number; // вид занятости
	ratel: number; // ставка
	isstudent: boolean; // является ли сотрудник студентом
	academicTitle?: string; // ученое звание
	academicDegree?: string; // ученая степень:
	beginDate?: string; // дата начала общего стажа
	lengthOfService?: number; // стаж по специальности в годах
	maxHours: number; // максимально часов учебной нагрузки
	minHours: number; // минимально часов учебной нагрузки
	unitId?: string; // ref-key на подразделения
};
