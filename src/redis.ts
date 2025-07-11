import * as dotenv from 'dotenv';
import { createClient, RedisClientType } from 'redis';
dotenv.config({ path: `./.env.${process.env.NODE_ENV}.local` });

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

const redisClient: RedisClientType = createClient({
	url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisClient.connect();

redisClient.on('error', err => {
	console.log('Redis Client Error, retrying in 5 seconds', err);
});
redisClient.on('connect', () =>
	console.log(
		`Connected to Redis Client on ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
	)
);

export default redisClient;
