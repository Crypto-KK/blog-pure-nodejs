const fs = require("fs")

const path = require("path")



// callback 

// function getFileContent(fileName, cb) {
//     const fullFileName = path.resolve(__dirname, 'files', fileName)
//     fs.readFile(fullFileName, (err, data) => {
//         if (err) {
//             console.log(err)
//             return
//         }
//         cb(
//             JSON.parse(data.toString())
//         )
//     })
// }


// getFileContent("a.json", (aData) => {
//     console.log('a data', aData)
//     getFileContent(aData.next, (bData) => {
//         console.log('b data', bData)
//         getFileContent(bData.next, (cData) => {
//             console.log("c", cData)
//         })
//     })
// })

function getFileContent(fileName) {
    const promise = new Promise((resolve, reject) => {
        const fullFileName = path.resolve(__dirname, 'files', fileName)
        fs.readFile(fullFileName, (err, data) => {
            if (err) {
                reject(err)
                return
            }
            resolve(
                JSON.parse(data.toString())
            )
        })
    })

    return promise
}

getFileContent("a.json").then(aData => {
    console.log("a data", aData)
    return getFileContent(aData.next)
}).then(bData => {
    console.log("b data", bData)
    return getFileContent(bData.next)
}).then(cData => {
    console.log("c data", cData)

})


function getLight(color, delay) {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(color)
        }, delay)
        resolve("success")

    })
    return promise
}

getLight("red", 1000).then((data) => {
    console.log(data)
})