export type TGroupEntity = {
	id: string; // ID
	name: string; // группа по ID в ЮФУ
	instituteName?: string; // группа для института
	trainingDirection?: string; // направление подготовки
	program?: string; // Программа
	course: string; // Курс обучения
};
