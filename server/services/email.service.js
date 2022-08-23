import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import 'dotenv/config'


let transporter = nodemailer.createTransport({
    service:"Gmail",
    secure: true,
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASSWORD
    }
})

export const registerEmail = async(userEmail,user) => {
    try{
        // const emailToken = user.generateRegisterToken();
        let mailGenerator = new Mailgen({
            theme:"default",
            product:{
                name:"Defect Management(ForQAByQA)",
                link:`${process.env.EMAIL_MAIN_URL}`
            }
        });

        const email = {
          body:{
              name: `${user.firstname} ${user.lastname}`,
              intro: 'Welcome to Defect Management(ForQAByQA)! \n A admin have created a account for you.',
              action:{
                instructions: 'Please get your account credentials from your admin and login to change your password to proceed',
                button:{
                    color:'#1a73e8',
                    text: 'Account validation',
                    link: `${process.env.SITE_DOMAIN}auth`
                }
                },
                outro: 'Please contact your admin if you have any questions.'
          }
        }

        let emailBody = mailGenerator.generate(email)
        let message = {
            from: process.env.EMAIL,
            to: userEmail,
            subject: "Welcome to Defect Tracker",
            html:emailBody
        }

        await transporter.sendMail(message)
        return true;
    } catch(error){
        throw error
    }
}