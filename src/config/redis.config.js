import { createClient } from 'redis';

const client = createClient({
    url: `redis://${process.env.REDIS_HOST}:6379`,
});

try {
    await client.connect();
} catch (error) {
    console.error(error.message);
}

export default client;