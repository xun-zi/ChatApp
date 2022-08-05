
const express = require('express');
const app = express();
const cors = require('cors')
const Router = require('./Router')

const IP = '127.0.0.1'
const port = '8080'

app.use(express.json())
app.use('/assest',express.static('./assest'))
app.use(cors());
app.use(Router);

let id = 1;
const account = new Map();
account.set('1228304333+yqskeaisile1',id);
app.get('/Login',(req,res) => {
    console.log('get /Login')
    const {username,password} = req.query
    const ident = `${username}+${password}`;
    if(account.has(ident)){
        res.send(JSON.stringify({token:account.get(ident) + '',state:true}));
    }else{
        res.send(JSON.stringify({state:false}))
    }
})

app.listen(port,IP,()=>{
    console.log(`http://${IP}:${port}`)
})