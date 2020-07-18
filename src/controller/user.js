const { execute, escape } = require("../db/mysql")

const login = (username, password) => {
    username = escape(username)
    console.log(username)
    password = escape(password)
    const sql = `
        select username, realname from users where username = ${username}
        and password = ${password}
    `
    console.log(sql)
    return execute(sql).then(rows => {
        return rows[0] || {}
    })
}

module.exports = {
    login
}