const redis = require("redis");

const client = redis.createClient({
   url: process.env.REDIS_URL
});

client.connect();

client.on("connect", () => {
   console.log("Redis Connected");
});

client.on("error", (err) => {
   console.log(err);
});

module.exports = client;