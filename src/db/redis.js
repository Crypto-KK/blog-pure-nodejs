const {REDIS_CONF} = require("../conf/db")

const redis = require("redis")

const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)


redisClient.on('error', err => {
    console.error(err)
})

function set(key, val) {
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }
    redisClient.set(key, val, redis.print)
}

function get(key) {
    const promise = new Promise((resolve, reject) => {
        redisClient.get(key, (err, value) => {
            if (err) {
                reject(err)
                return
            }
            if (value == null) {
                resolve(null)
                return
            }
            try {
                resolve(
                    JSON.parse(value)
                )
            } catch(ex) {
                resolve(
                    value
                )
            }
        })
    })
    return promise
}

module.exports = {
    set,
    get
}
