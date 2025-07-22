import { Logger } from '../common/utils/logger';
import { employeeToPerson } from './convertor/employeeToPerson';
import { specialtiesTransaction } from './convertor/specialties';
import { studentsToPerson } from './convertor/studentsToPerson';

const logger = new Logger();

export const transactions = async () => {
	logger.log(`Data synchronization has started`, {
		service: 'transaction',
	});

	await specialtiesTransaction()
		.then(() => studentsToPerson())
		.then(() => employeeToPerson());

	logger.success(`Data synchronization completed`, {
		service: 'transaction',
	});
};
