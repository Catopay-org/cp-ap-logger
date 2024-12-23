import Config from "@/Config";
import { calculatePagination, manageSorting } from "@/Utils/helper/queryOptimize";
import { IQueryItems } from "@/Utils/types/query.type";
import { ERole, Prisma, PrismaClient, TxnEventLog } from "@prisma/client";
import { TProcessTxnEventLogPayload } from "./txnEventLog.types";
import { TxnEventLogUtils } from "./txnEventLog.utils";

// Prisma Client setup
const TxnEventLogPrismaClient = new PrismaClient({
    datasourceUrl: Config.mongo_uri_for_event,
});

const getLogs = async (payload: IQueryItems<TxnEventLog>) => {
    const { skip, limit, page } = calculatePagination(payload.paginationFields);
    const { sortBy, sortOrder } = manageSorting(payload.sortFields);

    const query: Prisma.TxnEventLogWhereInput = {
        referenceId: payload.filterFields.referenceId,
    };

    const logs = await TxnEventLogPrismaClient.txnEventLog.findMany({
        where: payload.filterFields ? query : {},
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
    });

    const total = await TxnEventLogPrismaClient.txnEventLog.count({
        where: payload.filterFields ? query : {},
    });

    return { logs, total };
};

const getLogByReferenceId = async (referenceId: string, role: ERole, uid: string) => {
    const query: Prisma.TxnEventLogWhereInput = {
        referenceId: referenceId,
    };

    const select: Prisma.TxnEventLogSelect = {
        performerUID: true,
        amount: true,
        currency: true,
        transactionType: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        eventType: true,
        subEventType: true,
        consumerRole: true,
    };

    const logs: TxnEventLog[] = await TxnEventLogPrismaClient.txnEventLog.findMany({
        where: query,
        select,
        orderBy: { createdAt: "desc" },
    });


    /**
     * ROLE BASED LOGS
     */

    const logAccess: Record<ERole, TxnEventLog[]> = {
        [ERole.ADMIN]: logs,
        [ERole.PLATFORM]: logs.filter((log) => log.consumerRole == role && log.performerUID === uid),
        [ERole.RECEIVER]: logs.filter((log) => log.consumerRole == role && log.performerUID === uid),
        [ERole.MODERATOR]: logs,
    };
    
    if(["ADMIN", "MODERATOR"].includes(role)) {
        return logAccess[role];
    }

    const finalLogs = logAccess[role]?.map((log) => {
        const { consumerRole, ...rest } = log;
        return rest;
    });
    return finalLogs;
};

const createTxnEventLog = async (payload: TProcessTxnEventLogPayload) => {
    const processedPayload = await TxnEventLogUtils.processTxnEventLog(payload);
    return await TxnEventLogPrismaClient.txnEventLog.create({
        data: processedPayload,
    });
};

export const TxnEventLogService = {
    createTxnEventLog,
    getLogs,
    getLogByReferenceId,
};