import { createClient, RedisClientType } from 'redis';
import { ConfigService } from './common/utils/config.service';
import { Logger } from './common/utils/logger';
const logger = new Logger();

const configService = new ConfigService();

export const bulkHSet = async (
	rc: RedisClientType,
	name: string,
	values: any,
	key_name: string
) => {
	const multi = rc.multi();
	for (const value of values) {
		multi.hSet(`${key_name}:${value.id}`, name, value.name);
	}
	await multi.exec();
};

export const fetchRedisValue = async (key: string) => redisClient.get(key);

export const deleteKeysByPrefix = async (prefix: string) => {
	let cursor = '0';
	do {
		const reply = await redisClient.scan(cursor, {
			MATCH: `${prefix}:*`,
			COUNT: 100,
		});

		cursor = reply.cursor;

		if (reply.keys.length > 0) {
			await redisClient.del(reply.keys);
		}
	} while (cursor !== '0');
};

const redisClient: RedisClientType = createClient({
	url: `redis://${configService.getOrThrow<string>(
		'REDIS_HOST'
	)}:${configService.getOrThrow<number>('REDIS_PORT')}`,
});

redisClient.connect();

redisClient.on('error', err => {
	logger.error(new Error(`Redis Client Error, retrying in 5 seconds: ${err}`), {
		service: 'redis',
	});
});
redisClient.on('connect', () =>
	logger.log(
		`Connected to Redis Client on ${configService.getOrThrow<string>(
			'REDIS_HOST'
		)}:${configService.getOrThrow<number>('REDIS_PORT')}`,
		{ service: 'redis' }
	)
);

export default redisClient;
