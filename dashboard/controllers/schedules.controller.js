import schedule, {scheduledJobs} from 'node-schedule';
import {json} from "express";
import * as util from "node:util";

// getAllSchedules
export async function getAllSchedules(req, res) {
    try {
        const allSchedules = scheduledJobs;
        // console.log(util.inspect(allSchedules));

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).send(JSON.stringify(util.inspect(allSchedules)));
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

// getSchedule
export function createSchedule(req, res) {
    try {
        const id = req.query.id
        const time = req.query.time
        const funct = req.query.function
        // const schedule = scheduledJobs[id];
        console.log(id, time, funct)
        // console.log(util.inspect(allSchedules));

        // res.setHeader('Content-Type', 'application/json');
        // return res.status(200).send(JSON.stringify(util.inspect(schedule)));
        return res.status(200).send(id+' '+time+' '+funct);
    } catch (e) {
        console.log(e)
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