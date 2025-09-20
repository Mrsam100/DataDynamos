const redis = require('redis');

class RedisClient {
    constructor() {
        this.client = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            this.client = redis.createClient({
                url: process.env.REDIS_URL || 'redis://localhost:6379',
                retry_strategy: (options) => {
                    if (options.error && options.error.code === 'ECONNREFUSED') {
                        console.error('Redis server connection refused');
                        return new Error('Redis server connection refused');
                    }
                    if (options.total_retry_time > 1000 * 60 * 60) {
                        console.error('Redis retry time exhausted');
                        return new Error('Retry time exhausted');
                    }
                    if (options.attempt > 10) {
                        console.error('Redis max retry attempts reached');
                        return undefined;
                    }
                    return Math.min(options.attempt * 100, 3000);
                }
            });

            this.client.on('error', (err) => {
                console.error('Redis Client Error:', err);
                this.isConnected = false;
            });

            this.client.on('connect', () => {
                console.log('Redis client connected');
                this.isConnected = true;
            });

            this.client.on('ready', () => {
                console.log('Redis client ready');
            });

            this.client.on('end', () => {
                console.log('Redis client disconnected');
                this.isConnected = false;
            });

            await this.client.connect();
        } catch (error) {
            console.error('Redis connection failed:', error);
            this.isConnected = false;
        }
    }

    async get(key) {
        if (!this.isConnected) return null;
        try {
            return await this.client.get(key);
        } catch (error) {
            console.error('Redis GET error:', error);
            return null;
        }
    }

    async set(key, value, expireInSeconds = null) {
        if (!this.isConnected) return false;
        try {
            if (expireInSeconds) {
                await this.client.setEx(key, expireInSeconds, value);
            } else {
                await this.client.set(key, value);
            }
            return true;
        } catch (error) {
            console.error('Redis SET error:', error);
            return false;
        }
    }

    async del(key) {
        if (!this.isConnected) return false;
        try {
            await this.client.del(key);
            return true;
        } catch (error) {
            console.error('Redis DEL error:', error);
            return false;
        }
    }

    async disconnect() {
        if (this.client) {
            await this.client.quit();
            this.isConnected = false;
        }
    }
}

// Create singleton instance
const redisClient = new RedisClient();

module.exports = redisClient;
