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
        const emailToken = user.generateRegisterToken();
        let mailGenerator = new Mailgen({
            theme:"default",
            product:{
                name:"Defect Tracker",
                link:`${process.env.EMAIL_MAIN_URL}`
            }
        });

        const email = {
          body:{
              name: userEmail,
              intro: 'Welcome to Defect Tracker!',
              action:{
                instructions: 'To validate your account, please click here:',
                button:{
                    color:'#1a73e8',
                    text: 'Validate your account',
                    link: `${process.env.SITE_DOMAIN}verification?t=${emailToken}`
                }
                },
                outro: 'Please reply to this email if you need help, or have any questions.'
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