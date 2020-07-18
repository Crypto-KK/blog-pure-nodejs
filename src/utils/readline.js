const fs = require("fs")
const path = require("path")
const readline = require("readline")
const fileName = path.join(__dirname, "../", "../", "logs", "access.log")

const readStream = fs.createReadStream(fileName)

const rl = readline.createInterface({
    input: readStream
})

let postmanNum = 0
let sum = 0

rl.on("line", (lineData) => {
    if (!lineData) {
        return
    }
    console.log(lineData)
    // // 总行数
    // sum ++
    // const arr = lineData.split(" -- ")

})