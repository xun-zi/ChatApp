const express = require('express');
const { resolve } = require('path');
const Router = express.Router()

//id分配
let token = 1;
let UserToken = new Map()
let Userpassword = new Map();
Userpassword.set('1228304333', 'yqskeaisile1')
UserToken.set('1228304333', '1');
function verifyToken({ username, token }) {
    if (!UserToken.has(username) || !(UserToken.get(username) === token)) {
        console.log('验证失败');
        return false;
    } else return true;
}

Router.get('/Login', (req, res) => {
    console.log('get /Login')
    const { username, password } = req.query

    if (Userpassword.has(username) && Userpassword.get(username) == password) {
        UserToken.set(username, token);
        res.send(JSON.stringify({ token: getTokenByAcpa.get(token++) + '', state: true }));
    } else {
        res.send(JSON.stringify({ state: false }))
    }
})

Router.get('/data/:id', (req, res) => {
    import(`./assest/${req.params.id}/userData.js`).then((data) => {
        data.default.picture = `http://127.0.0.1:8080/assest/${req.params.id}/picture.jpg`
        data.default.uuid = req.params.id
        res.send(JSON.stringify(data.default));
    })
})

const userMessage = new Map();
const awaitRequset = new Map();


Router.post('/send', (req, res) => {
    console.log('send');
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
    console.log('验证成功')
    console.log(userMessage.get(target))
    //响应
    //目标在线就发送
    console.log('target',target);
    const fn = awaitRequset.get(target)
    console.log('fn',fn);
    if(fn){
        fn(userMessage.get(target));
        awaitRequset.delete(target);
        userMessage.delete(target);
    }

    // console.log(userMessage.get(target))

    //通知结果
    res.send('发送成功')
})

Router.get('/getMessage', (req, res) => {
    console.log(req.query);
    console.log('/getMessage');
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
        res.send(userMessage.get(username));
    }else{
        //请等待
        console.log('我在等待')
        awaitRequset.set(username,(data) => {
            console.log('等待完毕')
            res.send(data);
        })
        console.log(awaitRequset.get(username))
    }
    
})

module.exports = Router