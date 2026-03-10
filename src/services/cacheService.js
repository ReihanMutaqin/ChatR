const NodeCache = require('node-cache');

/**
 * CacheService - in-memory cache wrapper
 */
class CacheService {
    constructor(ttlSeconds = 300) {
        this.cache = new NodeCache({
            stdTTL: ttlSeconds,
            checkperiod: ttlSeconds * 0.2,
            useClones: false,
        });
    }

    get(key) {
        return this.cache.get(key);
    }

    set(key, value, ttl) {
        return this.cache.set(key, value, ttl);
    }

    del(key) {
        return this.cache.del(key);
    }

    has(key) {
        return this.cache.has(key);
    }

    flush() {
        this.cache.flushAll();
    }

    getStats() {
        return this.cache.getStats();
    }
}

// Singleton instances
const generalCache = new CacheService(300);   // 5 menit
const rateLimitCache = new CacheService(120); // 2 menit
const aiHistoryCache = new CacheService(600); // 10 menit

module.exports = { CacheService, generalCache, rateLimitCache, aiHistoryCache };
