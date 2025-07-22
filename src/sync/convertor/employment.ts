import { Logger } from '../../common/utils/logger';
import { Prisma } from '../../generated/prisma/local';
import { prismaLocal } from '../../prisma';
const logger = new Logger();

export const employmentsTransaction = async (
    data: Map<string, Prisma.employmentsCreateInput>
) => {
    logger.log('Employments synchronization has started', {
        service: 'employments',
    });
    const employments = Array.from(data.values());

    for (const employment of employments) {
        await prismaLocal.employments.upsert({
            where: {
                key: employment.key,
            },
            update: employment,
            create: employment,
        });
    }
   
    logger.success('Employments synchronization completed', {
        service: 'employments',
    });
};
