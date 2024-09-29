import schedule, {scheduledJobs} from 'node-schedule';
import * as util from "node:util";
import {PowerOff, PowerOn} from "../../modules/PowerActions.js";
import fs from "node:fs";

// getAllSchedules
export async function getAllSchedules(req, res) {
    try {
        const allSchedules = Object.keys(scheduledJobs).map(key => ({
            name: key,
            nextInvocation: scheduledJobs[key].nextInvocation(),
            rule: scheduledJobs[key].recurrenceRule,
        }));
        res.render('schedules', { allSchedules });
    } catch (e) {
        console.log(e)
    }
}

// getSchedule
export function getSchedule(req, res) {
    try {
        const id = req.params.id
        const schedule = scheduledJobs[id];
        console.log(id)

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).send(JSON.stringify(util.inspect(schedule)));
    } catch (e) {
        console.log(e)
    }
}

const SCHEDULES_FILE = './schedules.json';

function saveSchedulesToFile(schedules) {
    fs.writeFileSync(SCHEDULES_FILE, JSON.stringify(schedules, null, 2));
}

function loadSchedulesFromFile() {
    if (fs.existsSync(SCHEDULES_FILE)) {
        const data = fs.readFileSync(SCHEDULES_FILE);
        return JSON.parse(data);
    }
    return {};
}


export function createSchedule(req, res) {
    try {
        const { id, time, funct } = req.body;
        const days = req.body.days;
        const [hour, minute] = time.split(':');

        const selectedDays = Array.isArray(days) ? days.map(Number) : [Number(days)];

        let taskFunction;
        if (funct === "PowerOn") taskFunction = PowerOn;
        else if (funct === "PowerOff") taskFunction = PowerOff;
        else return res.status(400).send('Invalid function specified');

        if (schedule.scheduledJobs[id]) {
            schedule.scheduledJobs[id].cancel();
        }

        const rule = new schedule.RecurrenceRule();
        rule.hour = parseInt(hour, 10);
        rule.minute = parseInt(minute, 10);
        rule.dayOfWeek = selectedDays;

        const job = schedule.scheduleJob(id, rule, taskFunction);
        const allSchedules = loadSchedulesFromFile();

        allSchedules[id] = { id, time, funct, days: selectedDays };

        saveSchedulesToFile(allSchedules);

        res.redirect('/schedules');
    } catch (e) {
        console.log(e);
        res.status(500).send('Failed to create schedule');
    }
}

// export function defaultSchedule(req, res) {
//     try {
//         const SCHEDULES_FILE = './schedules-default.json';
//         let schedules = null;
//         if (fs.existsSync(SCHEDULES_FILE)) {
//             const data = fs.readFileSync(SCHEDULES_FILE);
//             schedules = JSON.parse(data);
//         }
//
//         if (!schedules) return res.status(500).send('No file');
//         Object.values(schedules).forEach(({ id, time, funct }) => {
//             const [hour, minute] = time.split(':');
//
//             let taskFunction;
//             if (funct === "PowerOn") taskFunction = PowerOn;
//             else if (funct === "PowerOff") taskFunction = PowerOff;
//
//             schedule.scheduleJob(id, `${minute} ${hour} * * *`, taskFunction);
//             console.log(`Restored job: ${id} at ${time} for function ${funct}`);
//         });
//
//
//         res.redirect('/schedules');
//     } catch (e) {
//         console.log(e);
//         res.status(500).send('Failed to create schedule');
//     }
// }


export function deleteSchedule(req, res) {
    try {
        const id = req.params.id;
        const job = scheduledJobs[id];
        if (job) {
            job.cancel();
            const allSchedules = loadSchedulesFromFile();
            delete allSchedules[id];
            saveSchedulesToFile(allSchedules);
            res.redirect('/schedules');
        } else {
            res.status(404).send('Job not found');
        }
    } catch (e) {
        console.log(e);
        res.status(500).send('Failed to delete schedule');
    }
}

// update
// export async function updateSchedule(req, res) {
//     try {
//         const botId = req.params.id;
//         const botData = req.body;
//         const bot = await botsClient.update({
//             where: {
//                 id: botId,
//             },
//             data: botData,
//         })
//
//         res.status(200).json({data: bot});
//     } catch (e) {
//         console.log(e)
//     }
// }