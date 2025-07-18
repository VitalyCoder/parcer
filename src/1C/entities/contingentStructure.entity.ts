export type TContingentStructureEntity = {
	id: string;
	lineNumber: number; // номер строки
	loadType: string; // ВидНагрузки
	loadTypeDataType: string; // ВидНагрузки_Type тип данных
	numberOfTheUnifiedLine: string; // номер объединенной строки
	trainingTypeId: string; //ref-key на вид обучения
	educationFormId: string; //ref-key на форма обучения
	budgetId: string; // ref-key на бюджет
	specialtyId: string; // ref-key на специальность
	disciplineId: string; // ref-key на дисциплину
	monitoringPeriod: string; // ref-key на ПериодКонтроля
	contingent: string; // контингент
	contingentType: string; // тип данных контингента
	uniqueNumberLines: string; // УникальныйНомерСтроки
	parent: string; // Родитель
	curriculumId: string; // ref-key на учебный план
	studentsNumber: number; // колличество студентов
	periodControlOrder: number; // порядок периода контроля
	durationStudyDiscipline: number; // продолжительность изучения дисциплины
	typeControlTheEndId: string; // вид контроля при  окончании
	planeLineUID: string; // Уникальный Идентификатор Строки Плана
};
