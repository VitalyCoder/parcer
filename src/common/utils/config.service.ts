import * as dotenv from 'dotenv';
dotenv.config({ path: `./.env.${process.env.NODE_ENV}.local` });

export class ConfigService {
	public get<T = string>(key: string): T | undefined {
		const value = process.env[key];
		return value as unknown as T;
	}

	public getOrThrow<T = string>(key: string): T {
		const value = process.env[key];
		if (value === undefined) {
			throw new Error(`Config key "${key}" is not defined`);
		}
		return value as unknown as T;
	}
}
