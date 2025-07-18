export type TAssignmentToDivisionsEntity = {
	id: string;
	lineNumber: number; // номер строки
	loadType: string; // ВидНагрузки
	loadTypeDataType: string; // ВидНагрузки_Type тип данных
	numberOfTheUnifiedContingentLine: string; // номер объединенной строки контингента
	contingentLineUID: string; // Уникальный Идентификатор Строки контингента
	unitId: string; // ref-key на подразделения
	unitMeasurementId: string; //  ref-key на Единица Измерения
	ruleId: string; //  ref-key на правило
	quantity: number; // колличество
};
