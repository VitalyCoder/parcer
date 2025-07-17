import {TContingentStructureEntity} from './contingentStructure.entity'
import {TAssignmentToDivisionsEntity} from './assignmentToDivisions.entity'


export type TContingentFormationByUnitEntity = {
   id: string;
   dataVersion: string;
   deletionMark: boolean;
   number: number;
   date: string;
   posted: boolean;
   responsibleID: string; // ответственный
   responsibleType: string; // тип данных отвественного
   schoolYearID: string; // учебный год
   trainingTypeID: string; // вид обучения
   transferNextCourse: boolean; // ВыполненПереводНаСледующийКур
   dataIsFilled: boolean; // ДанныеЗаполнены
   unitId: string; // ref-key на подразделения
   departmentID: string; // Кафедра_Key
   datelastChange: string; // ДатаПоследнегоИзменения
   createdBeforeTransition: boolean; // Объект Создан До Перехода На 1182
   academicPlanTable: []; // Таблица Учебного Плана
   contingentTable: []; // Таблица Контингента
   сontingentStructure: Array<TContingentStructureEntity> // Структура Контингента
   assignmentToDivisions: Array<TAssignmentToDivisionsEntity> // Закрепление За Подразделениями
   schoolYearLinkUrl: string; // Url-адрес навигационной ссылки на учебный год
   DepartmentLinkUrl: string;//  Url-адрес навигационной ссылки на кафедру
};

