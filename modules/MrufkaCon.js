import axios from "axios";
import {Agent} from "node:https";
import {configDotenv} from "dotenv";
let url = 'https://mrufka.local/api/atx';
configDotenv();

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