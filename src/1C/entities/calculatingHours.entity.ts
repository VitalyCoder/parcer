export type TcalculatingHourseEntity = {
    id: string; // ref-key
    lineNumber: number; // номер строки
    educationFormId: string; //ref-key на форма обучения
    budgetId: string; // ref-key на бюджет
    specialtyId: string; // ref-key на специальность
    disciplineId: string; // ref-key на дисциплину
    monitoringPeriod: string; // ref-key на ПериодКонтроля
    load: string; // Нагрузка
    loadType: string; // тип данных Нагрузка
    contingentLoad: string; // Контингент Нагрузки
    contingentLoadType: string; //тип данных Контингент Нагрузки
    quantity: number; // колличество
    ruleId: string; //  ref-key на правило
    unitMeasurementId: string; //  ref-key на Единица Измерения
    UId: string; // Уникальный Идентификатор
    contingentUId: string; // Уникальный Идентификатор Контингента
    curriculumId: string; // ref-key на учебный план
    numberCombinedContingent: number; // Номер Объединенного Контингента
    percentageAnchoring:  number; // ПроцентЗакрепления
    distributed: number; //распределено
    UIdRuleLine: string; // Уникальный Идентификатор Строки Правила
    studentsNumber: number; //Количество Обучающихся
    typeControlTheEndId: string; // вид контроля при  окончании
    quantityBudget: number; // Количество Бюджет
    quantityFullPayment: number;// Количество Полная Оплата
    quantityRatingControl: number;// Количество Рейтинг Контроль
    quantityRatingControlCalculation: number;//Количество Рейтинг Контроль По Расчету
    presentationControlPeriod:  string; // Представление Периода Контроля
    quantityClassroom: number; // Количество Аудиторные
    quantityVzet: number; // Количество ВЗЕТ

}


