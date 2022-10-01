import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import 'dotenv/config'


let transporter = nodemailer.createTransport({
    service: "Gmail",
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
})

export const mail = async (mailInfo) => {
    try {
        // const emailToken = user.generateRegisterToken();
        let mailGenerator = new Mailgen({
            theme: "default",
            product: {
                name: "Defect Management(ForQAByQA)",
                link: `${process.env.EMAIL_MAIN_URL}`
            }
        });

        let email = {
            body: {
                name: mailInfo.name,
                intro: mailInfo.intro,
                outro: mailInfo.outro,
                greeting: 'Hi'
            }
        }

        const button = {
            action: {
                instructions: mailInfo.instructions,
                button: {
                    color: '#1a73e8',
                    text: mailInfo.buttonText,
                    link: `${process.env.SITE_DOMAIN}${mailInfo.link}`
                }
            }
        }

        if (mailInfo.showButton) {
            email.body = {
                ...email.body,
                ...button,
            }
        }

        if(mailInfo.showGreeting === false){
            email.body.greeting = false
        }

        let emailBody = mailGenerator.generate(email)
        let message = {
            from: process.env.EMAIL,
            to: mailInfo.toEmail,
            subject: mailInfo.subject,
            html: emailBody
        }

        await transporter.sendMail(message)
        return true;
    } catch (error) {
        throw error
    }
}