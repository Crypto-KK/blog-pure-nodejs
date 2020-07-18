const redis = require("redis")

const redisClient = redis.createClient(6379, "127.0.0.1")

redisClient.on('error', err => {
    console.error(err)
})

redisClient.set('name', 'kk', redis.print)
redisClient.get("name", (err, value) => {
    if (err) {
        console.error(err)
        return
    }
    console.log('val:', value)


    redisClient.quit()
})