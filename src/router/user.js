const handleBlogRouter = require("./blog")
const {login} = require('../controller/user')
const { SuccessModel, ErrorModel } = require("../model/resModel")
const { get, set } = require("../db/redis")

const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    console.log(d)
    return d.toGMTString()
}

const handleUserRouter = (req, res) => {
    const method = req.method
    const path = req.path


    // 登录
    if (method === "POST" && path === "/api/user/login") {
        const {username, password} = req.body
        const result = login(username, password)
        return result.then(data => {
            if (data.username) {
                // 设置session
                req.session.username = data.username
                req.session.realname = data.realname
                let userId = req.cookie['userid']
                console.log(userId)
                get("SESSION_DATA").then(data => {
                    let SESSION_DATA = data
                    SESSION_DATA[userId] = {
                        username: req.session.username,
                        realname: req.session.realname
                    }
                    set("SESSION_DATA", JSON.stringify(SESSION_DATA))
                })
                return new SuccessModel("登录成功")
            } else {
                return new ErrorModel("登录失败")
            }
        })

    }

    if (method === 'GET' && path === '/api/user/loginTest') {
        if (req.session.username) {
            return Promise.resolve(new SuccessModel({
                session: req.session
            }))
        } else {
            return Promise.resolve(new ErrorModel("未登录"))
        }
    }
}

module.exports = handleUserRouter