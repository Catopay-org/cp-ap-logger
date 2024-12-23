import catchAsync from "@/Utils/helper/catchAsync";
import { queryOptimization } from "@/Utils/helper/queryOptimize";
import { sendResponse } from "@/Utils/helper/sendResponse";
import { ERole, TxnEventLog } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { TxnEventLogService } from "./txnEventLog.services";

const fetchLogs = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = queryOptimization<TxnEventLog>(req, ["referenceId"]);
    const data = await TxnEventLogService.getLogs(payload);
    sendResponse.success(res, {
        statusCode: 200,
        message: "Txn event logs fetched successfully",
        data: data,
    });
});

const fetchSingleLog = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = z.string({
        required_error: "Transaction ID is required",
    }).parse(req.params.id);

    const role = req.headers.role;
    const uid = req.headers.uid;
    const data = await TxnEventLogService.getLogByReferenceId(id, role as ERole, uid as string);
    sendResponse.success(res, {
        statusCode: 200,
        message: "Txn event log fetched successfully",
        data: data,
        req
    });
});

export const TxnEventLogController = {
    fetchLogs,
    fetchSingleLog,
};
