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
import redisClient, { bulkHSet, deleteKeysByPrefix } from '../redis';

// Функции для получения данных и кэширования в Redis
const getPositions = async () => {
	await deleteKeysByPrefix('position');
	const positions = await getAllPositions();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('position', positions)
	);
};

const getRates = async () => {
	await deleteKeysByPrefix('rate');
	const rates = await getAllRates();
	await misc.mSetInBatches(redisClient, misc.convertArrayToFlat('rate', rates));
};

const getNames = async () => {
	await deleteKeysByPrefix('person');
	const names = await getAllNames();
	await bulkHSet(redisClient, 'name', names, 'person');
};

const getEmails = async () => {
	const emails = await getAllEmails();
	await bulkHSet(redisClient, 'email', emails, 'person');
};

const getUnits = async () => {
	await deleteKeysByPrefix('unit');
	const units = await getAllUnits();
	await misc.mSetInBatches(redisClient, misc.convertArrayToFlat('unit', units));
};

const getSchoolYears = async () => {
	await deleteKeysByPrefix('schoolYear');
	const schoolYears = await getAllSchoolYears();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('schoolYear', schoolYears)
	);
};

const getCurriculum = async () => {
	await deleteKeysByPrefix('curriculum');
	const curriculum = await getAllCurriculum();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('curriculum', curriculum)
	);
};

const getEducationForms = async () => {
	await deleteKeysByPrefix('educationForm');
	const educationForms = await getAllEducationForms();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('educationForm', educationForms)
	);
};

const getSpecialties = async () => {
	await deleteKeysByPrefix('specialty');
	const specialties = await getAllSpecialties();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('specialty', specialties)
	);
};

const getSpecializations = async () => {
	await deleteKeysByPrefix('specialization');
	const specializations = await getAllSpecializations();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('specialization', specializations)
	);
};

const getGroups = async () => {
	await deleteKeysByPrefix('group');
	const groups = await getAllGroups();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('group', groups)
	);
};

const getCourses = async () => {
	await deleteKeysByPrefix('course');
	const courses = await getAllCourses();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('course', courses)
	);
};

const getSubgroups = async () => {
	await deleteKeysByPrefix('subgroup');
	const subgroups = await getAllSubgroups();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('subgroup', subgroups)
	);
};

const getConditions = async () => {
	await deleteKeysByPrefix('condition');
	const conditions = await getAllConditions();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('condition', conditions)
	);
};

const getOrderTypes = async () => {
	await deleteKeysByPrefix('orderType');
	const orderTypes = await getAllOrderTypes();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('orderType', orderTypes)
	);
};

const getFormsOfOrders = async () => {
	await deleteKeysByPrefix('formOfOrder');
	const formsOfOrders = await getAllFormOfOrders();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('formOfOrder', formsOfOrders)
	);
};

const getBases = async () => {
	await deleteKeysByPrefix('basis');
	const bases = await getAllBases();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('basis', bases)
	);
};

const getCreditBooks = async () => {
	await deleteKeysByPrefix('creditBook');
	const creditBooks = await getAllCreditBooks();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('creditBook', creditBooks)
	);
};

const getBranchesOfScience = async () => {
	await deleteKeysByPrefix('branchOfScience');
	const branchesOfScience = await getAllBranchesOfScience();
	await misc.mSetInBatches(
		redisClient,
		misc.convertArrayToFlat('branchOfScience', branchesOfScience)
	);
};

const getPlatoons = async () => {
	await deleteKeysByPrefix('platoon');
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
	} catch (e) {
		console.error('❌ Synchronization error:', e);
	}
};
