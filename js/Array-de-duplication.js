var a = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 3, 2, 1]

//new Set()   数组去重
var b = new Set(a)

//reducer map 去重

function fun(arr) {
    var c = []
    arr.reduce((req,next)=>{
        if(!req.get(next)){
            req.set(next,1)
            c.push(next)
        }
    },new Map())
    return c
}

console.log('%c [  ]-4', 'font-size:13px; background:pink; color:#bf2c9f;', fun(a))