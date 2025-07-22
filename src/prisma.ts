import { PrismaClient as localClient } from './generated/prisma/local';
import { PrismaClient as remoteClient } from './generated/prisma/remote';

const prismaLocal = new localClient();
const prismaRemote = new remoteClient();

export { prismaLocal, prismaRemote };
