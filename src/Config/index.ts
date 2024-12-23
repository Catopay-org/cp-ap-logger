import { config } from "dotenv";
import path from "path";

config({
    path: path.join(process.cwd(), ".env")
})

export default {
    port: process.env.PORT || 9000,
    mongo_uri: process.env.MONGO_URI,
    mongo_uri_for_event: process.env.MONGO_URI_FOR_EVENT,
    mongo_uri_for_store_sms: process.env.MONGO_URI_FOR_STORE_SMS,
    node_env: process.env.NODE_ENV,
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    mail: {
        hostName: process.env.HOST,
        port: process.env.PORT || 587,
        secure: process.env.SECURE,
        auth: {
            user: String(process.env.SMTPUSERNAME),
            password: String(process.env.SMTPPASSWORD)
        },
        token: process.env.MAILTOKEN as string,
        sendgrid_api_key: process.env.SENDGRID_API_KEY,
    },
    paymentInfo: {
        payment_gateway_url: process.env.PAYMENTGATEWAY_URL,
    },
    better_stack_source_token: process.env.SOURCE_TOKEN
}