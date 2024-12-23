import config from "@/Config";
import CustomError from "@/Utils/errors/customError.class";
import sgMail, { MailDataRequired } from "@sendgrid/mail";
import { MailtrapClient } from "mailtrap";

type TMailPayload = {
    receiverEmail: string,
    subject?: string,
    html?: string,
    category?: string
    template_uuid: string,
    template_variables: {
        [key: string]: string | number,
    }
}
export const sendAMail = async ({
    receiverEmail, category, subject, html, template_variables, template_uuid
}: TMailPayload) => {

    const { token } = config.mail

    const sender = {
        email: "support@trelyt.store",
        name: "Trelyt Support",
    };

    const recipients = [
        {
            email: receiverEmail,
        }
    ];

    const client = new MailtrapClient({ token });

    // console.log('pre mail', {
    //     from: sender,
    //     to: recipients,
    //     subject,
    //     html,
    //     category
    // })
    client
        .send({
            from: sender,
            to: recipients,
            // subject,
            // html,
            template_variables, template_uuid,
            category
        })
        .then((res => {
            console.log(res)
            return res.success
        }))
        .catch(err => {
            console.error("Error sending mail", err.message)
            throw new CustomError(err.message, 500)
        });
}


export const sgMailSender = async (payload: MailDataRequired) => {
    try {
        await sgMail.send(payload)
        return true
    } catch (error) {
        console.error('Error sending email', error);
        if (error instanceof Error)
            throw new CustomError(error.message, 500)
    }
}