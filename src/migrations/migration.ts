import { departmentMigration } from './services/department.migration';
import { educationMigration } from './services/education.migration';
import { groupMigration } from './services/group.migration.type';
import { personMigration } from './services/person.migration.type';
import { specialtyMigration } from './services/specialty.migration.type';

export const migration = async () => {
	console.log(`➡️ Data migration has started`);

	await specialtyMigration()
		.then(() => educationMigration())
		.then(() => groupMigration())
		.then(() => departmentMigration())
		.then(() => personMigration());

	console.log(`✅ Data migration completed`);
};
