import { Router } from "express";

const refundRoutes = Router()
refundRoutes
    .get('/all', (req, res) => {
        res.send('Refund Router')
    })

export default refundRoutes