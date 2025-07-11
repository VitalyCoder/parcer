import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import express from 'express';
import expressWs from 'express-ws';
import * as fs from 'fs';
import morgan from 'morgan';
import winston from 'winston';
const { app, getWss } = expressWs(express());

import cors from './common/middlewares/cors';

import { errorHandler } from './common/middlewares/error-handler';
import logger from './common/utils/logger';
import { PrismaClient } from './generated/prisma';
import sync from './sync/sync';
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

// cron section

// error handler
app.use(errorHandler);

// prisma section
export const prisma = new PrismaClient();

// sync section
void (async () => await sync())();

export const aWss = getWss();
export default app;
