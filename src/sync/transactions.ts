import { employeeToPerson } from './convertor/employeeToPerson';
import { specialtiesTransaction } from './convertor/specialties';
import { studentsToPerson } from './convertor/studentsToPerson';

export const transactions = async () => {
	console.log(`➡️ Data synchronization has started`);

	await specialtiesTransaction()
		.then(() => studentsToPerson())
		.then(() => employeeToPerson());

	console.log(`✅ Data synchronization completed`);
};
