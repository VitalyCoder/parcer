import { TcalculatingHourseEntity } from './calculatingHours.entity';
import { TcalculationAdditionalLoadEntity } from './calculationAdditionalLoad.entity';
import { TDistributionDataEntity } from './distributionData.entity';
import { navigationLinkUrl } from './navigationLinkUrl.enity';

export type TOneWorkloadEntity = {
	id: string;
	dataVersion: string;
	deletionMark: boolean;
	number: number;
	date: Date;
	posted: boolean;
	departmentID: string; // Кафедра_Key
	educationTypeId: string; // ref-key на вид образования
	responsibleID: string; // ответственный
	responsibleType: string; // тип данных отвественного
	schoolYearID: string; // учебный год
	datelastChange: string; // ДатаПоследнегоИзменения
	createdBeforeTransition: boolean; // Объект Создан До Перехода На 1182
	distributionData: Array<TDistributionDataEntity>; // Данные По Распределению
	calculatingHours: Array<TcalculatingHourseEntity>; //РасчетЧасов
	calculationAdditionalLoad: Array<TcalculationAdditionalLoadEntity>; // Расчет Дополнительной Нагрузки
	recommendedAuditoriums: []; // РекомендуемыеАудитории
	notesSchedule: []; // ПримечанияКРасписанию
	DepartmentLinkUrl: navigationLinkUrl; //  Url-адрес навигационной ссылки на кафедру
	schoolYearLinkUrl: navigationLinkUrl; // Url-адрес навигационной ссылки на учебный год
};
