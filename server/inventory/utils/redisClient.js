const Redis = require("ioredis");

const redis = new Redis({
  host: "host.docker.internal",  // or "localhost"
  port: 6379,         // default Redis port
});

redis.on("connect", () => {
  console.log("redis connected succesfully")
})

async function clearCache(pattern) {
  try {
    let cursor = "0";

    do {
      // scan in batches of 100
      const [newCursor, keys] = await redis.scan(cursor, "MATCH", pattern, "COUNT", 100);
      console.log(newCursor)
      console.log(keys)
      cursor = newCursor;

      if (keys.length > 0) {
        await redis.del(...keys);
        console.log(`Deleted ${keys.length} keys in this batch`);
      }
    } while (cursor !== "0"); // keep scanning until cursor resets to 0

    console.log("✅ All  offset cache keys deleted");
  } catch (err) {
    console.error("Error clearing category cache:", err);
  }
}





module.exports = { redis, clearCache }