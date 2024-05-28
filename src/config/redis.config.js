import { createClient } from 'redis';

const client = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASS,
});

await client.connect();

export default client;