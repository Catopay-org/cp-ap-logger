import { Router } from "express";

const paymentRoutes = Router()
paymentRoutes
    .use('/payment', (req, res) => {
        res.send('Payment Router')
    })

export default paymentRoutes