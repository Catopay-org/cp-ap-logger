import { config } from "dotenv";
import path from "path";

config({
    path: path.join(process.cwd(), ".env")
})

export default {
    port: process.env.PORT || 9000,
    mongo_uri: process.env.MONGO_URI,
    mongo_uri_for_event: process.env.MONGO_URI_FOR_EVENT,
    node_env: process.env.NODE_ENV,
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    paymentInfo: {
        payment_gateway_url: process.env.PAYMENTGATEWAY_URL,
    },
    jwt: {
        refreshToken: {
            secret: process.env.JWT_REFRESHTOKEN_SECRET || 'JWT_REFRESHTOKEN_SECRET',
            exp: process.env.JWT_REFRESHTOKEN_EXP || '48h'
        },
        common: process.env.JWT
    }
}