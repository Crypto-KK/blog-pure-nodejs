// process.stdin.pipe(process.stdout)

// const http = require("http")
// http.createServer((req, res) => {
//     if (req.method === "POST") {
//         req.pipe(res)
//     }
// }).listen(8000)


const fs = require("fs")
const path = require("path")

data = path.resolve(__dirname, "data.txt")
data_bak = path.resolve(__dirname, "data.bak.txt")

const readStream = fs.createReadStream(data)
const writeStream = fs.createWriteStream(data_bak)

readStream.pipe(writeStream)
readStream.on("data", chunk => {
    console.log(chunk.toString())
})
readStream.on("end", () => {
    console.log("success")
})