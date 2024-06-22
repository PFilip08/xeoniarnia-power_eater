import express from 'express';
import {configDotenv} from "dotenv";
import * as path from "node:path";
import { fileURLToPath } from 'url';
import schedulesRouter from "./routes/schedules.router.js";

const app = express();
configDotenv();
const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(__dirname + "/public"));

app.use('/schedules', schedulesRouter);

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})