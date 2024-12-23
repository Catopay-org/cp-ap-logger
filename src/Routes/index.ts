import { Router } from "express";

const rootRouter = Router()
rootRouter
    .use('/payment', (req, res) => {
        res.send('Hello World')
    })

export default rootRouter