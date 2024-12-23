import {NextFunction, Request, Response} from "express";
import catchAsync from "@/Utils/helper/catchAsync";
import {z} from "zod";
import jwt from "jsonwebtoken";
import config from "@/Config";
import {CustomJwtPayload} from "@/Utils/types/jwtHelper.type";
import {AuthServices} from "@/App/modules/Auth/auth.services";
import CustomError from "@/Utils/errors/customError.class";

const checkValidateAccess = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = z.string({
        required_error: 'Authorization token required'
    }).parse(req.headers.authorization?.split(' ')[1])

    const {uid, role, email} = jwt.verify(token, config.jwt.refreshToken.secret as string) as CustomJwtPayload

    const authData = await AuthServices.findAuthDataByUid(uid)

    if (!authData) {
        throw new CustomError('Access permission denied. ', 401)
    }

    req.headers['uid'] = uid
    req.headers['auid'] = authData.id
    req.headers['role'] = role
    req.headers['email'] = email
    next()
})

export const AccessMiddlewares = {
    checkValidateAccess
}