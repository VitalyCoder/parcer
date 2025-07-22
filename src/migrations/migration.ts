import { Logger } from '../common/utils/logger';
import { departmentMigration } from './services/department.migration';
import { educationMigration } from './services/education.migration';
import { groupMigration } from './services/group.migration.type';
import { personMigration } from './services/person.migration.type';
import { specialtyMigration } from './services/specialty.migration.type';
const logger = new Logger();

export const migration = async () => {
	logger.log('Data migration has started', {
		service: 'migration',
	});

	await specialtyMigration()
		.then(() => educationMigration())
		.then(() => groupMigration())
		.then(() => departmentMigration())
		.then(() => personMigration());

	logger.success('Data migration completed', {
		service: 'migration',
	});
};
