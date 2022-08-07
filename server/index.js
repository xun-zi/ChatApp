
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



app.listen(port,IP,()=>{
    console.log(`http://${IP}:${port}`)
})
