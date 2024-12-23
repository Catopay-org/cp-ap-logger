import sgMail from '@sendgrid/mail';
/* 
    node application root file
*/



import "@/Config/db";
import http from "http";
import app from './app';
import Config from './Config';

const logger_1 = require("./Utils/log/logger");

const server = http.createServer(app)

//configure email client
if (Config.mail.sendgrid_api_key) {
    sgMail.setApiKey(Config.mail.sendgrid_api_key);
}





const { port } = Config

const main = async () => {
    try {
        server.listen(port, () => {
            console.log(`Server is listening on ${port}. Url: http://localhost:${port}`)
            console.log(`Server documentation: http://localhost:${port}/docs`)
        })
    } catch (e) {
        console.log((e as Error).message);
    }
}

main()






//handle unHandleRejection errors
// For many types of unhandled rejections, it's not always necessary or advisable to close the server.
process.on('unhandledRejection', (err) => {
    (0, logger_1.systemErrorLogger)(err);
    console.log('unhandledRejection =>', { err });
    // setTimeout(() => {
    //     if (server) {
    //         server.close(() => {
    //             process.exit(1)
    //         })
    //     } else {
    //         process.exit(1)
    //     }
    // }, 5000);
});
//handle unCaught exceptions
process.on('uncaughtException', (err) => {
    (0, logger_1.systemErrorLogger)(err);
    console.log('unhandledException =>', { err });
    setTimeout(() => {
        if (server) {
            server.close(() => {
                process.exit(1);
            });
        }
    }, 5000);
});
// sigterm errors
process.on('SIGTERM', () => {
    const logMessage = 'SIGTERM signal received for graceful shutdown';
    (0, logger_1.systemErrorLogger)(logMessage); // Pass a message instead of an error
    console.log(logMessage);
    setTimeout(() => {
        if (server) {
            server.close(() => {
                console.log('HTTP server closed, exiting process');
                process.exit(0);
            });
        }
        else {
            console.log('No server instance, exiting process');
            process.exit(0);
        }
    }, 5000);
});
