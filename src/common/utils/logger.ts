import winston from 'winston';

export class Logger {
	public writer: winston.Logger;

	constructor() {
		this.writer = winston.createLogger({
			level: 'info',
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.json()
			),
			defaultMeta: { service: 'parser' },
			transports: [
				new winston.transports.File({ filename: 'error.log', level: 'error' }),
				new winston.transports.File({ filename: 'combined.log' }),
			],
		});

		if (process.env.NODE_ENV !== 'production') {
			this.writer.add(
				new winston.transports.Console({
					format: winston.format.combine(
						winston.format.colorize(),
						winston.format.printf(({ level, message, timestamp }) => {
							return `[${timestamp}] ${level}: ${message}`;
						})
					),
				})
			);
		}
	}

	public log(message: string, meta: Record<string, any> = {}): void {
		this.writer.info(`ℹ️  ${message}`, meta);
	}

	public warn(message: string, meta: Record<string, any> = {}): void {
		this.writer.warn(`⚠️  ${message}`, meta);
	}

	public error(message: string | Error, meta: Record<string, any> = {}): void {
		const errorMsg =
			message instanceof Error ? message.stack || message.message : message;
		this.writer.error(`❌ ${errorMsg}`, meta);
	}

	public success(message: string, meta: Record<string, any> = {}): void {
		this.writer.info(`✅ ${message}`, meta);
	}
}
