/* 
    express application root file
*/


import cors from 'cors';
import express, { Application } from 'express';
import configRoutes from './Routes/config';


const app: Application = express()
app.enable('trust proxy')
app.enable('x-powered-by')
// app.enable()
app.use(express.json({ limit: '50mb' }))
app.use(cors())

app.use(
    '/',
    // debuggerMiddleware,
    configRoutes
)


export default app
