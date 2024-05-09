const axios = require('axios');
const https = require("node:https");
const schedule = require('node-schedule')
require('dotenv').config();

let url = 'https://mrufka.local/api/atx';

const api = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
    headers: {
        'X-KVMD-User': process.env.USR,
        'X-KVMD-Passwd': process.env.PASSWD,
    }
})

// api.get(url)
//     .then(res => {
//         console.log(res.data);
//     })
//     .catch(err => {
//         console.log(err);
//     })

function PowerOff() {
    api.get(url).then(res => {
        if (!res.data.result.leds.power) return console.log('dawno off');
        api.post(url+'/power?action=off').then(console.log('wyłącza się'))
    }).catch(err=>console.log(err));
}

function PowerOn() {
    api.get(url).then(res => {
        if (res.data.result.leds.power) return console.log('dawno on');
        api.post(url+'/power?action=on').then(console.log('włącza się'))
    }).catch(err=>console.log(err));
}

schedule.scheduleJob('15 1 * * 1-5', PowerOff);
schedule.scheduleJob('45 13 * * 1-5', PowerOn);

console.log(schedule.scheduledJobs);
console.log('Zaplanowane roboty:\nPowerOn: 13:45\nPowerOff: 01:15')