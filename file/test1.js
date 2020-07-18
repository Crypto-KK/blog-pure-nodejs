const fs = require("fs")
const path = require("path")

const fileName = path.resolve(__dirname, "data.txt")

// fs.readFile(fileName, (err, data) => {
//     if (err) {
//         console.error(err)
//         return
//     }

//     console.log(data.toString())
    
// })





// const content = "新内容水电费金坷垃时代峻峰立刻就死定了发空间啊\n"
// const opt = {
//     flat: 'a'
// }
// fs.writeFile(fileName, content, opt, (err) => {
//     if (err) {
//         console.error(err)
//         return
//     }

// })







fs.exists(fileName, (exist) => {
    console.log(exist)
})