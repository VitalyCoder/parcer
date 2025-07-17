export type TcalculationAdditionalLoadEntity = {
    id: string; // ref-key
    lineNumber: number; // номер строки
    load: string; // Нагрузка
    loadType: string; // тип данных Нагрузка
    quantity: number; // колличество
    ruleId: string; //  ref-key на правило
    unitMeasurementId: string; //  ref-key на Единица Измерения
    UId: string; // Уникальный Идентификатор
    percentageAnchoring:  number; // ПроцентЗакрепления
    distributed: number; //распределено
    UIdRuleLine: string; // Уникальный Идентификатор Строки Правила
    studentsNumber: number; //Количество Обучающихся
    contingentLoad: string; // Контингент Нагрузки
    curriculumId: string; // ref-key на учебный план
    quantityVzet: number; // Количество ВЗЕТ
}
