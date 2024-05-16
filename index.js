import {PowerOff, PowerOn} from "./modules/PowerActions.js";
import schedule from 'node-schedule';
import './dashboard/app.js'
import fs from "node:fs";
import {configDotenv} from "dotenv";
configDotenv();

const config = JSON.parse(fs.readFileSync('./config.json'));
// console.log();

// default jobs
schedule.scheduleJob(`${config.PowerOffTime.split(':').reverse().join(' ')} * * 1-5`, PowerOff);
schedule.scheduleJob(`${config.PowerOnTime.split(':').reverse().join(' ')} * * 1-5`, PowerOn);

// console.log(schedule.scheduledJobs);
console.log(`Zaplanowane roboty: Pon-Pt\nPowerOn: ${config.PowerOnTime}\nPowerOff: ${config.PowerOffTime}`)