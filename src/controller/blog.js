const { execute } = require("../db/mysql")
const xss = require("xss")

const getList = (author, keyword) => {
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;`
    
    return execute(sql)

}

const getDetail = (id) => {
    let sql = `select * from blogs where id=${id};`
    return execute(sql).then(rows => {
        return rows[0]
    })
}

const newBlog = (blogData = {}) => {
    // blogData是对象
    const { title, content, author } = blogData
    title = xss(title)
    const createTime = Date.now()
    const sql = `
        insert into blogs(title, content, createtime, author)
        values('${title}', '${content}', '${createTime}', '${author}')
    `
    return execute(sql).then(insertData => {
        return {
            id: insertData.insertId
        }
    })
}

const updateBlog = (id, blogData = {}) => {
    // blogData是对象
    const { title, content } = blogData
    const sql = `
        update blogs set title='${title}', content='${content}' where id = ${id}
    `
    return execute(sql).then(updateData => {
        if (updateData.affectedRows > 0) {
            return true
        }
        return false
    })
}

const delBlog = (id, author) => {
    const sql = `delete from blogs where id = ${id} and author = '${author}'`
    return execute(sql).then(deldata => {
        if (deldata.affectedRows > 0) {
            return true
        }
        return false
    })
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}