import { createClient } from 'redis';

const client = createClient({
    url: process.env.REDIS_URL,
});

try {
    await client.connect();
} catch (error) {
    console.error(error.message);
}

export default client;