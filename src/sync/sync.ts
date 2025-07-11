import cliProgress from 'cli-progress';
import { getAllBases } from '../1C/repositories/bases.repository';
import { getAllBranchesOfScience } from '../1C/repositories/branchesOfScience.repository';
import { getAllConditions } from '../1C/repositories/conditions.repository';
import { getAllCourses } from '../1C/repositories/courses.repository';
import { getAllCreditBooks } from '../1C/repositories/creditBooks.repository';
import { getAllCurriculum } from '../1C/repositories/curriculum.repository';
import { getAllEducationForms } from '../1C/repositories/educationsForm.repository';
import { getAllEmails } from '../1C/repositories/emails.repository';
import { getAllFormOfOrders } from '../1C/repositories/formOfOrders.repository';
import { getAllGroups } from '../1C/repositories/groups.repository';
import { getAllNames } from '../1C/repositories/names.repository';
import { getAllOrderTypes } from '../1C/repositories/orderTypes.repository';
import { getAllPlatoons } from '../1C/repositories/platoons.repository';
import { getAllPositions } from '../1C/repositories/position.repository';
import { getAllRates } from '../1C/repositories/rates.repository';
import { getAllSchoolYears } from '../1C/repositories/shoolYears.repository';
import { getAllSpecializations } from '../1C/repositories/specializations.repository';
import { getAllSpecialties } from '../1C/repositories/specialties.repository';
import { getAllSubgroups } from '../1C/repositories/subgroups.repository';
import { getAllUnits } from '../1C/repositories/units.repository';
import misc from '../common/utils/misc';
import redisClient, { bulkHSet } from '../redis';
import { transactions } from './transactions';

// Функции для получения данных и кэширования в Redis
const getPositions = async () => {
	const positions = await getAllPositions();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('position', positions)
	);
};
const getRates = async () => {
	const rates = await getAllRates();
	await misc.mSetInBatches(redisClient, misc.convertArrayToFlat('rate', rates));
};
const getNames = async () => {
	const names = await getAllNames();
	await bulkHSet(redisClient, 'name', names, 'person');
};
const getEmails = async () => {
	const emails = await getAllEmails();
	await bulkHSet(redisClient, 'email', emails, 'person');
};
const getUnits = async () => {
	const units = await getAllUnits();
	await misc.mSetInBatches(redisClient, misc.convertArrayToFlat('unit', units));
};
const getSchoolYears = async () => {
	const schoolYears = await getAllSchoolYears();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('schoolYear', schoolYears)
	);
};
const getCurriculum = async () => {
	const curriculum = await getAllCurriculum();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('curriculum', curriculum)
	);
};
const getEducationForms = async () => {
	const educationForms = await getAllEducationForms();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('educationForm', educationForms)
	);
};
const getSpecialties = async () => {
	const specialties = await getAllSpecialties();

	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('specialty', specialties)
	);
};
const getSpecializations = async () => {
	const specializations = await getAllSpecializations();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('specialization', specializations)
	);
};
const getGroups = async () => {
	const groups = await getAllGroups();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('group', groups)
	);
};
const getCourses = async () => {
	const courses = await getAllCourses();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('course', courses)
	);
};
const getSubgroups = async () => {
	const subgroups = await getAllSubgroups();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('subgroup', subgroups)
	);
};
const getConditions = async () => {
	const conditions = await getAllConditions();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('condition', conditions)
	);
};
const getOrderTypes = async () => {
	const orderTypes = await getAllOrderTypes();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('orderType', orderTypes)
	);
};
const getFormsOfOrders = async () => {
	const formsOfOrders = await getAllFormOfOrders();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('formOfOrder', formsOfOrders)
	);
};
const getBases = async () => {
	const bases = await getAllBases();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('basis', bases)
	);
};
const getCreditBooks = async () => {
	const creditBooks = await getAllCreditBooks();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('creditBook', creditBooks)
	);
};
const getBranchesOfScience = async () => {
	const branchesOfScience = await getAllBranchesOfScience();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('branchOfScience', branchesOfScience)
	);
};
const getPlatoons = async () => {
	const platoons = await getAllPlatoons();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('platoon', platoons)
	);
};

export default async () => {
	console.log('Start data synchronization');

	try {
		const dataFetchFunctions = [
			{ name: 'Positions', func: getPositions },
			{ name: 'Rates', func: getRates },
			{ name: 'Names', func: getNames },
			{ name: 'Emails', func: getEmails },
			{ name: 'Units', func: getUnits },
			{ name: 'School Years', func: getSchoolYears },
			{ name: 'Specialties', func: getSpecialties },
			{ name: 'Credit Books', func: getCreditBooks },
			{ name: 'Curriculum', func: getCurriculum },
			{ name: 'Education Forms', func: getEducationForms },
			{ name: 'Specializations', func: getSpecializations },
			{ name: 'Subgroups', func: getSubgroups },
			{ name: 'Conditions', func: getConditions },
			{ name: 'Order Types', func: getOrderTypes },
			{ name: 'Forms of Orders', func: getFormsOfOrders },
			{ name: 'Bases', func: getBases },
			{ name: 'Branches of Science', func: getBranchesOfScience },
			{ name: 'Platoons', func: getPlatoons },
			{ name: 'Courses', func: getCourses },
			{ name: 'Groups', func: getGroups },
		];

		// Прогресс бар для загрузки данных
		const progressBar = new cliProgress.SingleBar(
			{
				format:
					'Fetching Data | {bar} | {value}/{total} | {percentage}% | {name}',
				barCompleteChar: '\u2588',
				barIncompleteChar: '\u2591',
				hideCursor: true,
			},
			cliProgress.Presets.shades_classic
		);

		progressBar.start(dataFetchFunctions.length, 0, { name: '' });

		// Выполняем все функции последовательно для лучшего отображения прогресса
		for (const item of dataFetchFunctions) {
			try {
				await item.func();
				progressBar.increment(1, { name: item.name });
			} catch (error) {
				console.error(`Error fetching ${item.name}:`, error);
				progressBar.increment(1, { name: `${item.name} (failed)` });
			}
		}

		progressBar.stop();

		// Загрузка основных данных
		console.log('Loading all data...');
		await transactions();

		// console.log('Loading units...');
		// // await unit.loadUnits();

		// console.log('Loading employees...');
		// // await educator.loadEmployees();

		// console.log('Loading specialties...');
		// // await specialties.loadSpecialties();

		// console.log('Loading students and groups...');
		// // await students.loadStudentsAndGroups();

		// console.log('Synchronization completed successfully');
	} catch (e) {
		console.error('Synchronization error:', e);
	}
};
