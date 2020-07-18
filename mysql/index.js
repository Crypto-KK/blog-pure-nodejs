const mysql = require("mysql")

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '998219',
    port: '3306',
    database: 'nodejs-blog'
})

con.connect()

const sql = "select * from users"

con.query(sql, (err, result) => {
    if (err) {
        console.error(err)
        return
    }
    console.log(result)
})

con.end()
