import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import express, { Application } from 'express';
import * as fs from 'fs';
import morgan from 'morgan';
import cron from 'node-cron';
import winston from 'winston';

import cors from './common/middlewares/cors';
import { errorHandler } from './common/middlewares/error-handler';
import { ConfigService } from './common/utils/config.service';
import { Logger } from './common/utils/logger';
import { migration } from './migrations/migration';
import sync from './sync/sync';
import { transactions } from './sync/transactions';

export class App {
	private readonly app: Application;
	private readonly configService: ConfigService;
	private readonly logger: Logger;
	private readonly apiPort: number;
	private readonly nodeEnv: string;

	private constructor(app: Application) {
		this.app = app;
		this.configService = new ConfigService();
		this.logger = new Logger();
		this.apiPort = this.configService.getOrThrow<number>('API_PORT');
		this.nodeEnv = this.configService.getOrThrow<string>('NODE_ENV');
	}

	private ensureUploadDir(): this {
		const dir = './uploads';
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}
		return this;
	}

	private setupMiddlewares(): this {
		this.app.use(express.json({ limit: '10mb' }));
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(cors);
		this.app.use(cookieParser());
		this.app.use(
			cookieSession({
				maxAge: 30 * 24 * 60 * 60 * 1000,
				keys: [process.env.COOKIE_KEY as string],
			})
		);
		return this;
	}

	private setupLogger(): this {
		const logStream = fs.createWriteStream('access.log', { flags: 'a' });
		this.app.use(morgan('combined', { stream: logStream }));

		if (this.nodeEnv !== 'production') {
			this.logger.writer.add(
				new winston.transports.Console({
					format: winston.format.simple(),
				})
			);
		}
		return this;
	}

	private setupStaticRoutes(): this {
		this.app.use('/uploads', express.static('./uploads'));
		return this;
	}

	private setupErrorHandler(): this {
		this.app.use(errorHandler);
		return this;
	}

	private scheduleCronJobs(): this {
		// */5 * * * *
		// 0 2 * * *
		cron.schedule('*/5 * * * *', async () => {
			try {
				await this.syncService();
			} catch (error) {
				this.logger.error(new Error(`Cron Sync Error: ${error}`), {
					service: 'cron',
				});
			}
		});
		return this;
	}

	private async syncService(): Promise<this> {
		await sync()
			.then(() => transactions())
			.then(() => migration())
			.catch(error => {
				this.logger.error(`SyncService Error: ${error}`);
			});
		return this;
	}

	private async runApp(): Promise<this> {
		this.app.listen(this.apiPort, () => {
			this.logger.success(`Server is running on port ${this.apiPort}`);
		});

		await this.syncService();
		return this;
	}

	public static async run(): Promise<void> {
		const app = express();
		const instance = new App(app);

		await instance
			.setupLogger()
			.setupMiddlewares()
			.setupStaticRoutes()
			.setupErrorHandler()
			.ensureUploadDir()
			.scheduleCronJobs()
			.runApp();
	}
}
