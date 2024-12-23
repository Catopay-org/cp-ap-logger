import { AccessMiddlewares } from "@/Middlewares/AccessValidation";
import { Router } from "express";
import { TxnEventLogController } from "./txnEventLog.controller";

const TxnEventLogRouter = Router();

TxnEventLogRouter
    .get(
        "/",
        AccessMiddlewares.checkValidateAccess,
        TxnEventLogController.fetchLogs
    )
    .get(
        "/details/:id",
        AccessMiddlewares.checkValidateAccess,
        TxnEventLogController.fetchSingleLog
    )

export default TxnEventLogRouter;