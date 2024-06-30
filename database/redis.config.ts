import {createClient} from "redis";

const connectRedisClient = async () => {
    const client = createClient({url: process.env.REDIS_URI});

    return await client
        .on('error', err => console.log('Redis client error: ', err))
        .connect();
}

export {
    connectRedisClient
}