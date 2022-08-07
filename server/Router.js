const express = require('express');
const { resolve } = require('path');
const Router = express.Router()

//id分配
let token = 1;
const getTokenByAcpa = new Map();
const getIdBytoken = new Map();
getTokenByAcpa.set('1228304333+yqskeaisile1',token);
getIdBytoken.set(token,'1228304333+yqskeaisile1');

Router.get('/Login',(req,res) => {
    console.log('get /Login')
    const {username,password} = req.query
    const ident = `${username}+${password}`;

    if(getTokenByAcpa.has(ident)){
        res.send(JSON.stringify({token:getTokenByAcpa.get(ident) + '',state:true}));
    }else{
        res.send(JSON.stringify({state:false}))
    }
})

Router.get('/data/:id',(req,res) =>{
    import(`./assest/${req.params.id}/userData.js`).then((data) => {
        console.log(data.default)
        data.default.picture = `http://127.0.0.1:8080/assest/${req.params.id}/picture.jpg`
        data.default.uuid = req.params.id
        res.send(JSON.stringify(data.default));
    })
})

const userMessage = new Map();
userMessage.set(token,new Map());


Router.post('/send',(req,res) => {
    console.log('send');
    const {message,time,id,token} = req.query;
    const senderId = getIdBytoken.get(token);
    if(!userMessage.has(id))res.send('你发送的Id方不存在');
    const receiptMessage = userMessage.get(id);
    if(!receiptMessage.has(senderId)){
        userMessage.get(0)[id] = true;
        receiptMessage.set(senderId,[{
            message,
            time,
        }])
    }else{
        userMessage.get(0)[id] = true;
        receiptMessage.get(id).push({
            message,
            time,
        })
    }
})


Router.get('/getMessage',(req,res) => {
    console.log('/getMessage');
    const {id} = req.query;
    const timer = setInterval(() => {
        if(userMessage.get(0)[id]){
            clearInterval(timer);
            setTimeout(() => {
                userMessage.get(0)[id] = false;
                userMessage.set(id,new Map())
            },0)
            res.send(JSON.stringify({
                state:true,
                message:userMessage.get(id)
            }));
        }
    },1000)
    setTimeout(()=> {
        clearInterval(timer);
        res.send(JSON.parse({
            state:false,
        }))
    },1000 * 60 * 3)
})

module.exports = Router