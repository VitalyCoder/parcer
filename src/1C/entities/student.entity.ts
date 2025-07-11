export type TStudentEntity = {
	id: string; // ID
	email?: string; // sfedu-почта
	name: string; // фио
	creditBook: string; // зачетная книга
	initialCreditBook: string; // начальная зачетная книга
	schoolYear: string; // учебный год
	curriculum: string; // учебный план
	educationForm: string; // форма обучения
	educationLevel?: string; // уровень обучения
	isEmployeel: boolean; // является ли студент сотрудником
	specialization?: string; // специализация
	subgroup?: string; // подгруппа
	condition: string; // состояние
	VpcGroups?: Array<string>; // группы ВПК
	orderType: string; // тип приказа
	formoforder: string; // форма приказа
	startDate: string; // дата начала обучения
	endDate: string; // дата конца обучения
	comment?: string; // комментарий
	isDissertationDefended: boolean; // защита диссертации
	organizationOfDefense?: string; // организация защиты
	basis: string; // основа
	educationProgramLink?: string; // ссылка на образовательную программу
	hasIndividualplan: boolean; // имеет индивидуальный план обучения
	conditionalTransfer: boolean; // условный перевод
	branchOfScience?: string; // отрасль науки
	militaryTraining?: string; // военная подготовка
	platoon?: string; // взвод
	viewCreditBook: string; // представление зачетной книги
	specialtyId?: string; // ref-key на специальность
	groupId?: string; // ref-key на группу
};
