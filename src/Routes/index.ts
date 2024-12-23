import depositRoutes from "@/app/modules/deposit/deposit.routes";
import paymentRoutes from "@/app/modules/payment/payment.routes";
import refundRoutes from "@/app/modules/refund/refund.routes";
import withdrawRoutes from "@/app/modules/withdraw/withdraw.routes";
import { Router } from "express";

const rootRouter = Router()
rootRouter
    .use('/payment', paymentRoutes)
    .use('/deposit', depositRoutes)
    .use('/withdraw', withdrawRoutes)
    .use('/refund', refundRoutes)

export default rootRouter