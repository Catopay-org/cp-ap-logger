import config from "@/Config";
import CustomError from "@/Utils/errors/customError.class";
import { sendResponse } from "@/Utils/helper/sendResponse";
import { TCustomErrorResponse } from "@/Utils/types/response.type";
import { processMongooseValidationError } from "@/Utils/validation/mongoose.validation";
import { processZodValidation } from "@/Utils/validation/zod.validation";
import { ErrorRequestHandler } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { Error } from "mongoose";
import { ZodError } from "zod";


const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let defaultError: TCustomErrorResponse = {
        statusCode: 500,
        message: "Something went wrong !.",
        errorMessages: [],
        stack: config.node_env === "development" && err.stack ? err.stack : undefined,
        req
    }
    // config.node_env === 'development' && console.log({err})

    if (err instanceof Error.ValidationError || err instanceof Error.CastError) {
        const handler = processMongooseValidationError(err)
        defaultError.statusCode = handler.statusCode
        defaultError.message = handler.message
        defaultError.errorMessages = handler.errorMessages
    } else if (err instanceof CustomError) {
        defaultError.statusCode = err.statusCode
        defaultError.message = err.message
    } else if (err instanceof ZodError) {
        const handler = processZodValidation.errorValidation(err)
        defaultError.statusCode = handler.statusCode
        defaultError.message = handler.message
        defaultError.errorMessages = handler.errorMessages
    } else if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
        defaultError.statusCode = 400
        defaultError.message = err.message
        defaultError.stack = err.stack
        defaultError.errorMessages = [{
            path: err.name,
            message: err.message
        }]
    }
    console.log({
        error: {
            message: err.message,
            stack: err.stack,
            statusCode: err.statusCode,
            errorMessages: err.errorMessages,
        }
    })
    sendResponse.error(res, defaultError)
}

export default globalErrorHandler