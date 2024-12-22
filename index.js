import {PowerOff, PowerOn} from "./modules/PowerActions.js";
import schedule from 'node-schedule';
import './dashboard/app.js'
import fs from "node:fs";

const SCHEDULES_FILE = './schedules.json';
const DEFAULT_SCHEDULES_FILE = './schedules-default.json';

function loadSchedulesFromFile() {
    if (fs.existsSync(SCHEDULES_FILE)) {
        const data = fs.readFileSync(SCHEDULES_FILE);
        return JSON.parse(data);
    }
    return {};
}

function loadDefaultSchedules() {
    if (!fs.existsSync(DEFAULT_SCHEDULES_FILE)) {
        console.log("No default schedules file found.");
        return {};
    }

    const data = fs.readFileSync(DEFAULT_SCHEDULES_FILE);
    const defaultSchedules = JSON.parse(data);

    Object.values(defaultSchedules).forEach(({ id, time, funct, days }) => {
        const [hour, minute] = time.split(':');

        let taskFunction;
        if (funct === "PowerOn") taskFunction = PowerOn;
        else if (funct === "PowerOff") taskFunction = PowerOff;

        const rule = new schedule.RecurrenceRule();
        rule.hour = parseInt(hour, 10);
        rule.minute = parseInt(minute, 10);
        rule.dayOfWeek = days;

        const job = schedule.scheduleJob(id, rule, taskFunction);
        job.isDefault = true;

        console.log(`Loaded default job: ${id} at ${time} for function ${funct}`);
    });

    return defaultSchedules;
}

function restoreJobs() {
    const savedSchedules = loadSchedulesFromFile();
    Object.values(savedSchedules).forEach(({ id, time, funct, days }) => {
        const [hour, minute] = time.split(':');

        let taskFunction;
        if (funct === "PowerOn") taskFunction = PowerOn;
        else if (funct === "PowerOff") taskFunction = PowerOff;

        const rule = new schedule.RecurrenceRule();
        rule.hour = parseInt(hour, 10);
        rule.minute = parseInt(minute, 10);
        rule.dayOfWeek = days;

        schedule.scheduleJob(id, rule, taskFunction);
        console.log(`Restored job: ${id} at ${time} for function ${funct} on days ${days.join(', ')}`);
    });
}

// const config = JSON.parse(fs.readFileSync('./config.json'));
// console.log();

// default jobs
// schedule.scheduleJob("Power off",`${config.PowerOffTime.split(':').reverse().join(' ')} * * 1-5`, PowerOff);
// schedule.scheduleJob("Power on",`${config.PowerOnTime.split(':').reverse().join(' ')} * * 1-5`, PowerOn);

loadDefaultSchedules();
restoreJobs();

// console.log(schedule.scheduledJobs);
// console.log(`Zaplanowane roboty: Pon-Pt\nPowerOn: ${config.PowerOnTime}\nPowerOff: ${config.PowerOffTime}`)
console.log(`Zaplanowane roboty załadowane z pliku ${SCHEDULES_FILE}.`);

process.on('SIGINT', function () {
    schedule.gracefulShutdown()
        .then(() => process.exit(0))
});