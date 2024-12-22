import schedule, {scheduledJobs} from 'node-schedule';
import * as util from "node:util";
import {PowerOff, PowerOn} from "../../modules/PowerActions.js";
import fs from "node:fs";
import {restartJobs} from "../../index.js";

// getAllSchedules
export async function getAllSchedules(req, res) {
    try {
        const allSchedules = Object.keys(scheduledJobs).map(key => ({
            name: key,
            nextInvocation: new Date(scheduledJobs[key].nextInvocation()).toLocaleDateString('pl-PL', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            }).replace(/^\w/, c => c.toUpperCase()),
            rule: scheduledJobs[key].funct,
            isDefault: scheduledJobs[key].isDefault
        }));
        // console.log(allSchedules,scheduledJobs)
        res.render('schedules', { allSchedules });
    } catch (e) {
        console.log(e);
        res.status(500).send('Failed to get all schedules');
    }
}

// getSchedule
export function getSchedule(req, res) {
    try {
        const id = req.params.id
        const schedule = scheduledJobs[id];
        // console.log(id)

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).send(JSON.stringify(util.inspect(schedule)));
    } catch (e) {
        console.log(e);
        res.status(500).send('Failed to get schedule');
    }
}

const SCHEDULES_FILE = './schedules.json';
const DEFAULT_SCHEDULES_FILE = './schedules-default.json';

function saveSchedulesToFile(schedules) {
    fs.writeFileSync(SCHEDULES_FILE, JSON.stringify(schedules, null, 2));
}

function loadSchedulesFromFile(def=false) {
    const path = def ? DEFAULT_SCHEDULES_FILE : SCHEDULES_FILE;
    // console.log(def, path);
    if (fs.existsSync(path)) {
        const data = fs.readFileSync(path);
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

// edit
export function editSchedule(req, res) {
    try {
        const allSchedules = Object.values(loadSchedulesFromFile());
        let schedule = allSchedules.find(s => s.id === req.params.id);

        if (!schedule) {
            const defaultSchedules = Object.values(loadSchedulesFromFile(true));
            schedule = defaultSchedules.find(s => s.id === req.params.id);
        }

        if (schedule) {
            schedule.days = schedule.days || [];
        } else {
            return res.status(404).send('Schedule not found');
        }

        res.render('edit-schedule', { schedule });
    } catch (e) {
        console.error(e);
        res.status(500).send('Failed to edit schedule');
    }
}

// updateSchedule
export function updateSchedule(req, res) {
    try {
        const id = req.params.id;
        const { time, funct, days } = req.body;
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
        job.funct=funct;

        const schedules = loadSchedulesFromFile();
        schedules[id] = { id, time, funct, days: selectedDays };
        saveSchedulesToFile(schedules);

        res.redirect('/schedules');
    } catch (e) {
        console.log(e);
        res.status(500).send('Failed to update schedule');
    }
}

export async function restartButton(req, res) {
    try {
        await restartJobs();
        res.redirect('/schedules');
    } catch (e) {
        console.log(e);
        res.status(500).send('Failed to restart!!1');
    }
}