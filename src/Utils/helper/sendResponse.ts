import { pickFunction } from "@/Utils/helper/pickFunction";
import { TCustomErrorResponse, TGenericSuccessMessages } from "@/Utils/types/response.type";
import { Request, Response } from "express";
import { getLogServiceName, getRequestPayload, globalLoggerAssigner, globalLoggerChecker, globalLoggerInvoker } from "../log/logger";

const successResponse = <T, M>(res: Response, data: TGenericSuccessMessages<T, M>) => {
    const property = pickFunction(data, ["message", "data", "statusCode", "meta", "req"])
    const req = property.req as Request;
    delete property.req;

    const responsePayload = {
        success: true,
        ...property
        // message: data.message || null,
        // data: data.data,
        // meta: data?.meta || null
    }
    // localLogger(req, { ...responsePayload }, true)
    res.status(data.statusCode).json(responsePayload)
}

const errorResponse = (res: Response, data: TCustomErrorResponse) => {

    const property = pickFunction(data, ["errorMessages", "message", "statusCode", "stack", "req"])

    const req = property.req as Request;
    delete property.req;

    const responsePayload = {
        success: false,
        ...property
        // message: data.message,
        // errorMessages: data.errorMessages,
        // stack: data.stack,
        // statusCode: data.statusCode
    }
    // localLogger(req, { ...responsePayload }, false, "error")
    res.status(data.statusCode).json(responsePayload)
}

export const sendResponse = {
    success: successResponse,
    error: errorResponse
}


/**
 * @description - This function is used to log the response to the service
 * @param req - request object
 * @param responsePayload - response object
 * @param success - boolean
 * @param type - type of the log level e.g. error, warn, info, debug
 */
const localLogger = (req: Request, responsePayload: any, success: boolean, type?: "info" | "error" | "warn" | "debug") => {
    console.log('inside local logger', req.path)
    const { originalUrl, method } = getRequestPayload(req as Request);
    const { statusCode } = responsePayload;
    const serviceName = getLogServiceName(req as Request);

    /**
     * @description - This function is used to log the error response to the service
     * Step 1: Check if the service already has a logger
     * Step 2: If not, create a new logger
     * Step 3: Log the error response
     */
    // console.log('inside local logger', { method, statusCode, originalUrl, serviceName })
    if (method && statusCode && originalUrl) {
        // Check if the service already has a logger, if not, create a new logger
        const serviceAlreadyExists = globalLoggerChecker(serviceName)

        // create a new logger
        if (!serviceAlreadyExists) {
            globalLoggerAssigner(serviceName, "info")
        }

        if (success) {
            delete responsePayload.data
        }

        // Log the error response
        globalLoggerInvoker(serviceName, `${method} ${originalUrl} ${statusCode}`, { response: responsePayload, header: req?.rawHeaders }, type || "info")
    }
}