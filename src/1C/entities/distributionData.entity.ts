export type TDistributionDataEntity = {
	id: string; // ref-key
	lineNumber: number; // номер строки
	contingentUId: string; // Уникальный Идентификатор Контингента
	educationFormId: string; //ref-key на форма обучения
	budgetId: string; // ref-key на бюджет
	specialtyId: string; // ref-key на специальность
	disciplineId: string; // ref-key на дисциплину
	monitoringPeriod: string; // ref-key на ПериодКонтроля
	load: string; // Нагрузка
	loadType: string; // тип данных Нагрузка
	contingentLoad: string; // КонтингентНагрузки
	contingentLoadType: string; //тип данных КонтингентНагрузки
	percentageAnchoring: number; // ПроцентЗакрепления
	employeeId: string; // ID в 1C
	academicDegreeId: string; // ref-key ученая степень
	positionID: string; // ref-key должность
	ratelId: string; //ref-key ставка
	quantity: number; // колличество
	unitMeasurementId: string; //  ref-key на Единица Измерения
	accrualTypeId: string; // ref-key вид начисления
	UId: string; // Уникальный Идентификатор
	curriculumId: string; // ref-key на учебный план
	numberCombinedContingent: number; // Номер Объединенного Контингента
	calculationLineNumber: number; // Номер Строки Расчета
	studentsNumber: number; //Количество Обучающихся
	employmentType: string; // Вид Занятости
	quantityFact: number; // Количество Факт
	quantityVzet: number; // Количество ВЗЕТ
	employeesDepartmentId: string; // ПодразделениеСотрудника
};
