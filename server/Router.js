const express = require('express');
const { resolve } = require('path');
const Router = express.Router()

Router.get('/data/:id',(req,res) =>{
    import(`./assest/${req.params.id}/userData.js`).then((data) => {
        console.log(data.default)
        data.default.picture = `http://127.0.0.1:8080/assest/${req.params.id}/picture.jpg`
        data.default.uuid = req.params.id
        res.send(JSON.stringify(data.default));
    })
})

module.exports = Router