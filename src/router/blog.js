const { getList, getDetail, newBlog, updateBlog, delBlog } = require("../controller/blog")
const { SuccessModel, ErrorModel } = require("../model/resModel")


const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(new ErrorModel("未登录"))
    }
}


const handleBlogRouter = (req, res) => {
    const method = req.method
    const path = req.path
    const id = req.query.id
    // 获取列表
    if (method === "GET" && path === "/api/blog/list") {
        const author = req.query.author || ''
        const keyword = req.query.keyword || ''
        // const listData = getList(author, keyword)
        const result = getList(author, keyword)
        return result.then((listData) => {
            return new SuccessModel(listData)
        })
        
    }

    // 获取博客详情
    if (method === "GET" && path === "/api/blog/detail") {
        const result = getDetail(id)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }

    // 新建博客
    if (method === "POST" && path === "/api/blog/new") {
        // const data = newBlog(req.body)
        // return new SuccessModel(data)

        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            return loginCheckResult
        }
        req.body.author = req.session.username
        const result = newBlog(req.body)
        return result.then(data => {
            return new SuccessModel(data)
        })
        
    }

    // 更新博客
    if (method === "POST" && path === "/api/blog/update") {

        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            return loginCheckResult
        }

        const result = updateBlog(id, req.body)
        return result.then(val => {
            if (val) {
                return new SuccessModel()
            } else {
                return new ErrorModel("更新失败")
            }
        })

    }

    // 删除博客
    if (method === "POST" && path === "/api/blog/del") {

        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            return loginCheckResult
        }

        const result = delBlog(id, req.session.username)
        return result.then(val => {
            if (val) {
                return new SuccessModel()
            } else {
                return new ErrorModel("删除失败")
            }
        })

    }
}

module.exports = handleBlogRouter