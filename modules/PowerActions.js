import {api, url} from "./MrufkaCon.js";

function PowerOff() {
    api.get(url).then(res => {
        if (!res.data.result.leds.power) return console.log('dawno off');
        api.post(url+'/power?action=off').then(console.log('wyłącza się'));
    }).catch(err=>console.log(err));
}

function PowerOn() {
    api.get(url).then(res => {
        if (res.data.result.leds.power) return console.log('dawno on');
        api.post(url+'/power?action=on').then(console.log('włącza się'));
    }).catch(err=>console.log(err));
}

export {PowerOff, PowerOn}