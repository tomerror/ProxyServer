const express = require('express');
const app = express();
const http = require('http').createServer(app);
const rateLimit = require("express-rate-limit");
const io = require('socket.io')(http);
const axios = require('axios');
const moment = require('moment');
const NodeCache = require( "node-cache" );
const appCache = new NodeCache();
const config = require('./config.json');
const cors = require('cors')
const PORT = config.port
app.use(cors())
const apiLimiterMinutes = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: 'Too many requests, please try again later.'
});
const apiLimiterDays = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 1000,
    message: 'Too many requests, please try again later.'
});
app.use('/', apiLimiterMinutes);
app.use('/', apiLimiterDays);

getData = async (pageNumber) => {
    setTimeout(() => {
        axios.get(config.serverAPI + '?' + config.queryApi + pageNumber)
            .then(response => {
                appCache.set(config.lastFetchingDataCache + pageNumber, moment())
                appCache.set(config.queryKeyCache + pageNumber, response.data)
                io.emit('response', response.data)
            })
            .catch(error => {
                console.log(error)
                io.emit('error', config.serverError)
            })
    },3000)
}

app.get('/', (req, res) => {
    let page = req.query.page;
    value = appCache.get(config.lastFetchingDataCache + page);
    if ( value != undefined ){
        let lastTime = moment(value)
        let now =  moment()
        if((now.diff(lastTime) / 1000 / 60) < 5){
            let data = appCache.get(config.queryKeyCache + page)
            io.emit('response', data)
            res.send(config.proxyCacheAck)
        } else {
            getData(page)
            res.send(config.proxyAck)
        }
    } else {
        getData(page)
        res.send(config.proxyAck)
    }
})


http.listen(PORT, () => { console.log(config.serverOnAirMessage + PORT); });