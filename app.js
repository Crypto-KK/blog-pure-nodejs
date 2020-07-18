const querystring = require("querystring")
const handleBlogRouter = require("./src/router/blog")
const handleUserRouter = require("./src/router/user")
const { get, set } = require("./src/db/redis")
const {access} = require("./src/utils/log")
// SESSION数据

let SESSION_DATA = null
get("SESSION_DATA").then(data => {
    if (data) {
        SESSION_DATA = data
    } else {
        SESSION_DATA = null
    }
})

if (!SESSION_DATA) {
    set("SESSION_DATA", JSON.stringify({}))
    SESSION_DATA = {}
}
console.log(SESSION_DATA)



const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    console.log(d)
    return d.toGMTString()
}
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== "POST") {
            resolve({})
            return
        }

        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }

        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })

    return promise
}


const serverHandle = (req, res) => {
    // 记录access log
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)


    res.setHeader("Content-type", 'application/json')

    const url = req.url
    req.path = url.split("?")[0]

    // 解析queyr
    req.query = querystring.parse(url.split("?")[1])

    // 解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(";").forEach(item => {
        if (!item) {
            return
        }
        const arr = item.split("=")
        const key = arr[0].trim()
        const value = arr[1].trim()
        req.cookie[key] = value
    })

    // 解析session
    let needSetCookie = false
    let userId = req.cookie.userid
    if (userId) {
        if (!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {}
            set('SESSION_DATA', SESSION_DATA)
        }
    } else {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        SESSION_DATA[userId] = {} 
        set('SESSION_DATA', SESSION_DATA)
    }
    req.session = SESSION_DATA[userId]

    // 处理post data
    getPostData(req).then(postData => {
        req.body = postData 

        // 处理blog
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }

        


        // 处理user
        // const userData = handleUserRouter(req, res)
        // if (userData) {
        //     res.end(
        //         JSON.stringify(userData)
        //     )
        //     return
        // }
        const userResult = handleUserRouter(req, res)
        if (userResult) {
            userResult.then(userData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(userData)
                )
            })
            return
        }

            // 未命中
        res.writeHead(404, {"Content-Type": "text/plain"})
        res.write("404 not found\n")
        res.end()
    })



}

module.exports = serverHandle

//process.env.NODE_ENV