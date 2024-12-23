import { ECurrency, ESubEventType, ESystemRole, ETxnEventLogsEventType, ETxnEventLogType } from "@prisma/client";
import { Request } from "express";

// enum ETxnEventLogType {
//     PAYMENT = "payment",
//     WITHDRAWAL = "withdrawal",
//     REFUND = "refund",
// }

// enum ETxnEventLogEventsType {
//     PAYMENT_CREATED = "payment_created",
//     PAYMENT_SUBMITTED = "payment_submitted",
//     PAYMENT_CONFIRMED = "payment_confirmed",
//     PAYMENT_CANCELLED = "payment_cancelled",
//     PAYMENT_REJECTED = "payment_rejected",
//     PAYMENT_FAILED = "payment_failed",
//     WITHDRAWAL_CREATED = "withdrawal_created",
//     WITHDRAWAL_SUBMITTED = "withdrawal_submitted",
//     WITHDRAWAL_CONFIRMED = "withdrawal_confirmed",
//     WITHDRAWAL_CANCELLED = "withdrawal_cancelled",
//     WITHDRAWAL_REJECTED = "withdrawal_rejected",
//     WITHDRAWAL_FAILED = "withdrawal_failed",
//     REFUND_CREATED = "refund_created",
//     REFUND_SUBMITTED = "refund_submitted",
//     REFUND_CONFIRMED = "refund_confirmed",
//     REFUND_CANCELLED = "refund_cancelled",
//     REFUND_REJECTED = "refund_rejected",
//     REFUND_FAILED = "refund_failed",
// }

// enum EEventSecurityType {
//     BEARER_TOKEN = "bearer_token",
//     API_KEY = "api_key",
// }

// enum ECurrency {
//     USD = "USD",
//     BDT = "BDT",
// }

// enum EPerformerRole {
//     PLATFORM = "platform",
//     RECEIVER = "receiver",
//     MODERATOR = "moderator",
//     SYSTEM = "system",
// }

// export type TxnEventLog = {
//     amount: number;
//     currency: ECurrency;
//     transactionType: ETxnEventLogType;
//     referenceId: string;
//     performerUID: string | null;
//     performerRole: EPerformerRole;
//     description: string;
//     requestHeaders: Record<string, string>;
//     requestBody: Record<string, string>;
//     response: Record<string, string>;
//     eventType: ETxnEventLogEventsType;
//     securityType: EEventSecurityType;
//     metadata: Record<string, string>;
// }


export type TTxnEventLogCreateInput = {
    amount: number;
    description: string;
    metadata?: Record<string, string>;
    transactionType: ETxnEventLogType;
    transactionId: string;
    eventType: ETxnEventLogsEventType;
    currency?: ECurrency;
}

export type TProcessTxnEventLogPayload = {
    transactionId: string;
    eventType: ETxnEventLogsEventType;
    subEventType?: ESubEventType;
    request: Request;
    response: object;
    transactionType: ETxnEventLogType;
    amount: number;
    description: string;
    metadata?: Record<string, string>;
    currency?: ECurrency;
    consumerRole: ESystemRole
}
