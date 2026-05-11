const redis = require("redis");

const client = redis.createClient({
   url: process.env.REDIS_URL,
   socket: {
      reconnectStrategy: retries => {
         return Math.min(retries * 100, 3000);
      }
   }
});

(async () => {

   try {

      await client.connect();

      console.log("Redis Connected");

   } catch (error) {

      console.log("Redis Error:", error);

   }

})();

client.on("error", (err) => {
   console.log("Redis Client Error", err);
});

module.exports = client;