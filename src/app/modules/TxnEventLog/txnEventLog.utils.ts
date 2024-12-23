import prisma from "@/Config/db";
import { ECurrency, EEventSecurityType, ESystemRole, Prisma } from "@prisma/client";
import { Request } from "express";
import { TProcessTxnEventLogPayload } from "./txnEventLog.types";

const processTxnEventLog = async (payload: TProcessTxnEventLogPayload) => {

    const { securityType, performerUID, performerRole } = await processHeaders(payload.request);

    const processedPayload: Prisma.TxnEventLogCreateInput = {
        referenceId: payload.transactionId,
        eventType: payload.eventType,
        requestRawHeaders: payload.request.rawHeaders || [],
        requestBody: payload.request.body || {},
        response: payload.response,
        transactionType: payload.transactionType,
        amount: payload.amount,
        currency: payload.currency || ECurrency.BDT,
        performerUID,
        performerRole,
        description: payload.description,
        securityType,
        metadata: payload.metadata || {},
        consumerRole: payload.consumerRole,
        subEventType: payload.subEventType,
    };

    return processedPayload;
};

const processHeaders = async (request: Request) => {
    let securityType: EEventSecurityType;
    let performerUID: string;
    let performerRole: ESystemRole;

    if (request?.headers?.authorization?.split(' ')[1]) {
        securityType = EEventSecurityType.BEARER_TOKEN;
        performerUID = request?.headers?.uid as string;
        performerRole = request?.headers?.role as ESystemRole;
    } else if (request?.headers && request?.headers['x-api-key'] as string) {
        const user = await prisma.developmentInfo.findFirst({
            where: {
                apiKey: request?.headers['x-api-key'] as string
            },
            include: {
                user: {
                    include: {
                        auth: {
                            select: {
                                uid: true,
                                role: true
                            }
                        }
                    }
                }
            }
        })
        securityType = EEventSecurityType.API_KEY;
        performerUID = user?.user.auth?.uid as string;
        performerRole = user?.user.auth?.role as ESystemRole;
    } else {
        securityType = EEventSecurityType.NONE;
        performerUID = "";
        performerRole = ESystemRole.SYSTEM;
    }

    return { securityType, performerUID, performerRole };
};

export const TxnEventLogUtils = {
    processTxnEventLog,
};
