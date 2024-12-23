import { Router } from "express";

const depositRoutes = Router()
depositRoutes
    .get('/all', (req, res) => {
        res.send('Deposit Router')
    })

export default depositRoutes