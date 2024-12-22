import {Router} from "express";
import {createSchedule, deleteSchedule, editSchedule, getAllSchedules, getSchedule, restartButton, updateSchedule} from "../controllers/schedules.controller.js";

const schedulesRouter = Router();

schedulesRouter.get("/", getAllSchedules);
schedulesRouter.get("/find/:id", getSchedule);
schedulesRouter.get("/create", (req, res) => {
    res.render('create-schedule');
});
schedulesRouter.post("/create", createSchedule);
// schedulesRouter.post("/default", defaultSchedule);
schedulesRouter.get("/delete/:id", deleteSchedule);

schedulesRouter.get("/edit/:id", editSchedule);
schedulesRouter.post("/edit/:id", updateSchedule);

schedulesRouter.post("/restart", restartButton);

export default schedulesRouter;