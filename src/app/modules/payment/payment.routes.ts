import { Router } from "express";

const paymentRoutes = Router()
paymentRoutes
    .get('/all', (req, res) => {
        res.send('Payment Router')
    })

export default paymentRoutes