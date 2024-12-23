import { Router } from "express";

const withdrawRoutes = Router()
withdrawRoutes
    .get('/all', (req, res) => {
        res.send('Withdraw Router')
    })

export default withdrawRoutes