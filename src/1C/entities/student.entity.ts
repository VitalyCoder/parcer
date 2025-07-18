import { navigationLinkUrl } from './navigationLinkUrl.enity';

export type TStudentEntity = {
	period: string;
	recorder: string;
	recorder_Type: string;
	lineNumber: number;
	active: boolean;
	id: string; // ID ФизическоеЛицо_Key
	creditBookId: string; // зачетная книга
	initialCreditBookId: string; // начальная зачетная книга
	schoolYearId: string; // учебный год
	curriculumId: string; // учебный план
	workPlanId?: string; // Рабочий План
	educationFormId: string; // форма обучения
	departmentId: string; // Факультет
	specialtyId?: string; // ref-key на специальность
	specializationId: string; // специализация
	courseId: string; // курс
	groupId: string; // ref-key на группу
	subgroupId: string; // ref-key на подгруппу
	conditionId: string; // состояние
	orderTypeId: string; // тип приказа
	orderSpeciesId: string; //вид приказа
	startDate: string; // дата начала обучения
	endDate: string; // дата конца обучения
	analyticsId: string; // аналитика
	comment?: string; // комментарий
	isDissertationDefended: boolean; // защита диссертации
	organizationOfDefense?: string; // организация защиты
	organizationOfDefenseType?: string; //"ОрганизацияЗащиты_Type": "StandardODATA.Undefined",
	basisId: string; // основа
	Individualplan?: string; // индивидуальный план обучения
	hasIndividualplan: boolean; // имеет индивидуальный план обучения
	conditionalTransfer: boolean; // условный перевод
	branchOfScience?: string; // отрасль науки
	militaryTraining?: string; // военная подготовка
	platoon?: string; // взвод
	viewCreditBook: string; // представление зачетной книги
	// данные появятся позже
	person: navigationLinkUrl; //  Url-адрес навигационной ссылки на физ лицо
	creditBook: navigationLinkUrl; // Url-адрес навигационной ссылки на зачетную книжку
	initialCreditBook: navigationLinkUrl; // Url-адрес навигационной ссылки на  начальную зачетную книжку
	schoolYearLinkUrl: navigationLinkUrl; // Url-адрес навигационной ссылки на учебный год
	curriculum: navigationLinkUrl; // Url-адрес навигационной ссылки на учебный план
	trainingForm: navigationLinkUrl; // Url-адрес навигационной ссылки на форму обучения
	department: navigationLinkUrl; // Url-адрес навигационной ссылки на факультет
	specialty: navigationLinkUrl; // Url-адрес навигационной ссылки на специальность
	species: navigationLinkUrl; // Url-адрес навигационной ссылки на специализацию
	course: navigationLinkUrl; // Url-адрес навигационной ссылки на курс
	group: navigationLinkUrl; // Url-адрес навигационной ссылки на группу
	condition: navigationLinkUrl; // Url-адрес навигационной ссылки на состояние
	orderType: navigationLinkUrl; // Url-адрес навигационной ссылки на тип приказа
	orderSpecies: navigationLinkUrl; // Url-адрес навигационной ссылки на тип
	basis: navigationLinkUrl; // Url-адрес навигационной ссылки на тип
};
