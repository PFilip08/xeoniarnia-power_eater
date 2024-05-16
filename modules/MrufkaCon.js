import axios from "axios";
import {Agent} from "node:https";
let url = 'https://mrufka.local/api/atx';

const api = axios.create({
    httpsAgent: new Agent({
        rejectUnauthorized: false,
    }),
    headers: {
        'X-KVMD-User': process.env.USR,
        'X-KVMD-Passwd': process.env.PASSWD,
    }
});

export {api, url}