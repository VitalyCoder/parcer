import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import expressWs from 'express-ws';
import * as fs from 'fs';
import morgan from 'morgan';
import cron from 'node-cron';
import winston from 'winston';
const { app, getWss } = expressWs(express());

import cors from './common/middlewares/cors';

import { errorHandler } from './common/middlewares/error-handler';
import logger from './common/utils/logger';
import { PrismaClient as localClient } from './generated/prisma/local';
import { PrismaClient as remoteClient } from './generated/prisma/remote';
import { migration } from './migrations/migration';
import sync from './sync/sync';
import { transactions } from './sync/transactions';

const syncService = async () => {
	await sync()
		.then(() => transactions())
		.then(() => migration());
};

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors);
app.use(cookieParser());
app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000,
		keys: [process.env.COOKIE_KEY as string],
	})
);

const logStream = fs.createWriteStream('access.log', {
	flags: 'a',
});
app.use(morgan('combined', { stream: logStream }));
if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new winston.transports.Console({
			format: winston.format.simple(),
		})
	);
}

app.use('/uploads', express.static('./uploads'));
const dir = './uploads';
if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir);
}

app.use(errorHandler);

cron.schedule('0 2 * * *', async () => {
	try {
		await syncService();
	} catch (error) {
		console.error(`ошибка обновления данных: ${error}`);
	}
});

export const prismaLocal = new localClient();
export const prismaRemote = new remoteClient();

void (async () => {
	await syncService();
})();

export const aWss = getWss();
export default app;
