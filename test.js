const promises = Array(20).fill(1).map(item => () => { return new Promise() })

const result = []
let curIndex = 10
Promise.all(promises.slice(0, 10).map(item => item().then(res => {
    const newItem = promises[curIndex++]
    newItem().then(curRes => result.push(curRes))
    return res
}))).then(resList => {
    result = resList.concat(result)
})



