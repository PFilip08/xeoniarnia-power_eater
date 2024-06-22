import {Router} from "express";
import {createSchedule, getAllSchedules, getSchedule} from "../controllers/schedules.controller.js";

const schedulesRouter = Router();

schedulesRouter.get("/", getAllSchedules);
schedulesRouter.get("/find/:id", getSchedule);
schedulesRouter.get("/create", createSchedule);
export default schedulesRouter;