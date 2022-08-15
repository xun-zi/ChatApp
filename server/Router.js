const express = require('express');
const { resolve } = require('path');
const Router = express.Router()

//id分配
let token = 1;
let UserToken = new Map()
let Userpassword = new Map();
Userpassword.set('1228304333', '小马')
UserToken.set('1228304333', '1');

Userpassword.set('2','2');
UserToken.set('2', '2');

function verifyToken({ username, token }) {
    if (!UserToken.has(username) || !(UserToken.get(username) === token)) {
        console.log('验证失败');
        return false;
    } else return true;
}

Router.get('/Login', (req, res) => {
    const { username, password } = req.query
    console.log(req.query)
    if (Userpassword.has(username) && Userpassword.get(username) == password) {
        res.send(JSON.stringify({ token: UserToken.get(username) + '', state: true }));
    } else {
        res.send(JSON.stringify({ state: false }))
    }
})

const getBasicMessage = (id) => {
    // console.log(id)
    return new Promise((resolve) => {
        import(`./assest/${id}/userData.js`).then((data) => {
            data.default.picture = `http://127.0.0.1:8080/assest/${id}/picture.jpg`
            data.default.uuid = id
            resolve(data.default)
        })
    })
}



Router.get('/data/:id', (req, res) => {
   const data =  getBasicMessage(req.params.id)
   data.then((data)=>{
    res.send(data)
   })
})
let friendList = new Map();
friendList.set('1228304333',new Set())
friendList.set('2',new Set())
friendList.get('1228304333').add('2')
friendList.get('2').add('1228304333')
Router.get('/friend/:id',(req,res) => {
    // console.log(req.params)
    const {id} = req.params;
    (async function(){
        const myFriend = friendList.get(id);
        // console.log(myFriend)
        const data = [];
        for(let x of myFriend){
            data.push(await getBasicMessage(x));
        }
        res.send(data);
    })();
})

const userMessage = new Map();
const awaitRequset = new Map();


Router.post('/send', (req, res) => {
    let { verifyData, target, data } = req.body;
    target = target + '';
    //验证
    if (!verifyToken(verifyData)) res.send('验证失败');
    
    //消息请求
    if (!userMessage.has(target)) {
        userMessage.set(target, {
            [verifyData.username]: [data]
        })
    } else {
        const targetData = userMessage.get(target)[verifyData.username];
        targetData.push(data);
    }

    //响应
    //目标在线就发送
    const fn = awaitRequset.get(target)
    if(fn){
        fn(userMessage.get(target));
        awaitRequset.delete(target);
        userMessage.delete(target);
    }

    //通知结果
    res.send('发送成功')
})

Router.get('/getMessage', (req, res) => {
    const { username, token } = req.query;
    // if (!username || !token) res.send('你发送数据有缺失')
    //响应
    verifyToken({
        username,
        token
    })
    //拿取数据
    if(userMessage.has(username)){
        //拿取
        const data = userMessage.get(username)
        userMessage.delete(username);
        res.send(data);
    }else{
        //请等待
        awaitRequset.set(username,(data) => {
            res.send(data);
        })
    }
    
})

module.exports = Router