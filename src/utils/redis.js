const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");

// const client = redis.createClient(process.env.REDIS_URL);

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASS,
});

client.hget = util.promisify(client.hget);

client.on("ready", () => {
  console.log("Connecting to Redis");
});

client.on("error", (err) => {
  console.log("Fail to connect Redis");
});

// create new cache function on prototype
mongoose.Aggregate.prototype.cache = saveCache;
mongoose.Query.prototype.cache = saveCache;

// create reference for .exec
const execQuery = mongoose.Query.prototype.exec;
const execAggregate = mongoose.Aggregate.prototype.exec;

// override exec function to first check cache for data
mongoose.Query.prototype.exec = loadDataFromCache(execQuery, "Query");
mongoose.Aggregate.prototype.exec = loadDataFromCache(
  execAggregate,
  "Aggregate"
);

function saveCache(options) {
  this.useCache = true;
  this.expire = options?.expire || 60; // 60 seconds
  this.hashKey = JSON.stringify(
    options?.key || this.mongooseCollection?.name || "No Key"
  );

  return this;
}

function loadDataFromCache(exec, type) {
  return async function () {
    if (!this.useCache) {
      return await exec.apply(this, arguments);
    }

    let key;
    switch (type) {
      case "Query":
        key = JSON.stringify({
          ...this.getQuery(),
          collection: this.mongooseCollection.name,
        });
        break;
      case "Aggregate":
        key = JSON.stringify({
          ...this._pipeline[0],
        });
        break;
    }

    // get cached value from redis
    const cacheValue = await client.hget(this.hashKey, key);

    // if cache value is not found, fetch data from mongodb and cache it
    if (!cacheValue) {
      const result = await exec.apply(this, arguments);
      client.hset(this.hashKey, key, JSON.stringify(result));
      client.expire(this.hashKey, this.expire);

      console.log("Return data from MongoDB");
      return result;
    }

    // return found cachedValue
    const doc = JSON.parse(cacheValue);
    console.log("Return data from Redis");
    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  };
}

exports.clearHash = (hashKey) => {
  client.del(JSON.stringify(hashKey));
};
