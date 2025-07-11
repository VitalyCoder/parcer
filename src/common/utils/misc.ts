import { RedisClientType } from 'redis';

function convertArrayToFlat(key_name: string, arr: any) {
    return arr.flatMap((obj: any) => [`${key_name}:${obj.id}`, obj.name]);
}

async function mSetInBatches(redisClient: RedisClientType, data: any, batchSize = 10000) {
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        await redisClient.mSet(batch);
    }
}

export default {
    convertArrayToFlat,
    mSetInBatches,
};
