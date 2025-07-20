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
// import cronService from './services/cron.service';

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

// logger section
const logStream = fs.createWriteStream('access.log', {
	flags: 'a',
});
app.use(morgan('combined', { stream: logStream }));

// logger section
if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new winston.transports.Console({
			format: winston.format.simple(),
		})
	);
}

// uploader section
app.use('/uploads', express.static('./uploads'));
const dir = './uploads';
if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir);
}

// error handler
app.use(errorHandler);

// cron section
cron.schedule('0 0 * * 0', async () => {
	console.log('⏰ Starting scheduled sync: Sunday at 00:00');

	try {
		void (async () =>
			await sync()
				.then(() => transactions())
				.then(() => migration()))();
		console.log('✅ Scheduled synchronization completed successfully');
	} catch (error) {
		console.error('❌ Scheduled synchronization failed:', error);
	}
});

// prisma section
export const prismaLocal = new localClient();
export const prismaRemote = new remoteClient();

// sync section
// Загрузка основных данных
console.log('➡️ Loading all data...');
void (async () =>
	await sync()
		.then(() => transactions())
		.then(() => migration()))();
console.log('✅ Synchronization completed successfully');

export const aWss = getWss();
export default app;
