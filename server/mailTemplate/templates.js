import { emailService } from "../services/index.js"

//Project mail notification
export const mailProjectCreated = async (req, project) => {

    //send email

    let mailInfo;

    //ONLY email to the account that created this project
    mailInfo = {
        intro: `
                    <div>
                    <p>You have created a new Project
                    <span style="color:#9c27b0;"> ${project[0].title}</span>
                    </p>
                    <p><br></p>
                    <p style="text-decoration:underline;">Project Details:</p>
                    <table style="width: 100%;">
                        <tbody>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Title:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;padding-right: 2rem;overflow-wrap: anywhere;">${project[0].title}<br></td>
                            </tr>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Description:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project[0].description}<br></td>
                            </tr>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Components:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project[0].components.join(', ')}<br></td>
                            </tr>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Assignee:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project[0].assignee.join(', ')}<br></td>
                            </tr>
                        </tbody>
                    </table>
                    <p><br></p>
                    </div>
                `,
        showGreeting: false,
        showButton: false,
        subject: `(ForQAByQA) New Project created`,
        toEmail: req.user.email
    }
    await emailService.mail(mailInfo);


    //send to all assignee except for user who created the project
    project[0].assignee.map(async (email) => {
        if (email !== req.user.email) {
            mailInfo = {
                intro: `
                             <div>
                             <p><strong><span style="color:#00008b;font-size:1.3rem;">${req.user.username}</span></strong><span> has created and assigned you to a new project</span></p>
                             <p><br></p>
                             <p style="text-decoration:underline;">Project Details:</p>
                             <table style="width: 100%;">
                                 <tbody>
                                     <tr>
                                         <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Title:<br></td>
                                         <td style="width: 87.7486%;padding-top:1rem;padding-right: 2rem;overflow-wrap: anywhere;">${project[0].title}<br></td>
                                     </tr>
                                     <tr>
                                         <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Description:<br></td>
                                         <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project[0].description}<br></td>
                                     </tr>
                                     <tr>
                                         <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Components:<br></td>
                                         <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project[0].components.join(', ')}<br></td>
                                     </tr>
                                     <tr>
                                         <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Assignee:<br></td>
                                         <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project[0].assignee.join(', ')}<br></td>
                                     </tr>
                                 </tbody>
                             </table>
                             <p><br></p>
                             </div>
                         `,
                showGreeting: false,
                showButton: false,
                outro: "Please contact your admin if you have any questions.",
                subject: `(ForQAByQA) New Project created and assigned to you`,
                toEmail: email
            }
            await emailService.mail(mailInfo);
        }
    })
}

export const mailProjectComponentAdded = async (req, project) => {

    let mailInfo;

    project.assignee.map(async (email) => {

        if (email === req.user.email) {
            mailInfo = {
                intro: `
                    <div>
                    <p>You have added a new component</p>
                    <p><br></p>
                    <p>New component added: <span style="color:#9c27b0;">${req.body.components}</span><p>
                    <p><br></p>
                    <p style="text-decoration:underline;">Project Details:</p>
                    <table style="width: 100%;">
                        <tbody>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Title:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;padding-right: 2rem;overflow-wrap: anywhere;">${project.title}<br></td>
                            </tr>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Description:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project.description}<br></td>
                            </tr>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Components:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project.components.join(', ')}<br></td>
                            </tr>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Assignee:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project.assignee.join(', ')}<br></td>
                            </tr>
                        </tbody>
                    </table>
                    <p><br></p>
                    </div>
                `,
                showGreeting: false,
                showButton: false,
                // outro: "Please contact your admin if you have any questions.",
                subject: `(ForQAByQA) You have added a new component: "${req.body.components}" to ${project.title} `,
                toEmail: email
            }
            await emailService.mail(mailInfo);
        } else {
            mailInfo = {
                intro: `
                    <div>
                    <p><strong><span style="color:#00008b;font-size:1.3rem;">${req.user.username}</span></strong><span> have added a new component to a project that you are assigned to</span></p>
                    <p><br></p>
                    <p>New component added: <span style="color:#9c27b0;">${req.body.components}</span><p>
                    <p><br></p>
                    <p style="text-decoration:underline;">Project Details:</p>
                    <table style="width: 100%;">
                        <tbody>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Title:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;padding-right: 2rem;overflow-wrap: anywhere;">${project.title}<br></td>
                            </tr>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Description:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project.description}<br></td>
                            </tr>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Components:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project.components.join(', ')}<br></td>
                            </tr>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Assignee:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project.assignee.join(', ')}<br></td>
                            </tr>
                        </tbody>
                    </table>
                    <p><br></p>
                    </div>
                `,
                showGreeting: false,
                showButton: false,
                outro: "Please contact your admin if you have any questions.",
                subject: `(ForQAByQA) A project component: "${req.body.components}" have been added to ${project.title}`,
                toEmail: email
            }
            await emailService.mail(mailInfo);
        }
    })

}

export const mailProjectComponentRemoved = async (req, project) => {

    let mailInfo;

    project.assignee.map(async (email) => {

        if (email === req.user.email) {
            mailInfo = {
                intro: `
                    <div>
                    <p>You have removed a component</p>
                    <p><br></p>
                    <p>Component removed: <span style="color:#9c27b0;">${req.body.componentToBeRemove}</span><p>
                    <p><br></p>
                    <p style="text-decoration:underline;">Project Details:</p>
                    <table style="width: 100%;">
                        <tbody>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Title:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;padding-right: 2rem;overflow-wrap: anywhere;">${project.title}<br></td>
                            </tr>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Description:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project.description}<br></td>
                            </tr>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Components:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project.components.join(', ')}<br></td>
                            </tr>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Assignee:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project.assignee.join(', ')}<br></td>
                            </tr>
                        </tbody>
                    </table>
                    <p><br></p>
                    </div>
                `,
                showGreeting: false,
                showButton: false,
                // outro: "Please contact your admin if you have any questions.",
                subject: `(ForQAByQA) You have removed a component: "${req.body.componentToBeRemove}" from ${project.title} `,
                toEmail: email
            }
            await emailService.mail(mailInfo);
        } else {
            mailInfo = {
                intro: `
                    <div>
                    <p><strong><span style="color:#00008b;font-size:1.3rem;">${req.user.username}</span></strong><span> has removed a component from a project that you are assigned to</span></p>
                    <p><br></p>
                    <p>Component removed: <span style="color:#9c27b0;">${req.body.componentToBeRemove}</span><p>
                    <p><br></p>
                    <p style="text-decoration:underline;">Project Details:</p>
                    <table style="width: 100%;">
                        <tbody>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Title:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;padding-right: 2rem;overflow-wrap: anywhere;">${project.title}<br></td>
                            </tr>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Description:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project.description}<br></td>
                            </tr>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Components:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project.components.join(', ')}<br></td>
                            </tr>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Assignee:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project.assignee.join(', ')}<br></td>
                            </tr>
                        </tbody>
                    </table>
                    <p><br></p>
                    </div>
                `,
                showGreeting: false,
                showButton: false,
                outro: "Please contact your admin if you have any questions.",
                subject: `(ForQAByQA) A project component: "${req.body.componentToBeRemove}" have been removed from ${project.title}`,
                toEmail: email
            }
            await emailService.mail(mailInfo);
        }
    })
}

export const mailProjectAssigneeAdded = async (req, project) => {
    let mailInfo;
    //if assign self
    if (req.body.userEmail === req.user.email) {
        mailInfo = {
            intro: `
                        <div>
                        <p>You have assigned yourself to a project</p>
                        <p><br></p>
                        <p style="text-decoration:underline;">Project Details:</p>
                        <table style="width: 100%;">
                            <tbody>
                                <tr>
                                    <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Title:<br></td>
                                    <td style="width: 87.7486%;padding-top:1rem;padding-right: 2rem;overflow-wrap: anywhere;">${project[0].title}<br></td>
                                </tr>
                                <tr>
                                    <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Description:<br></td>
                                    <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project[0].description}<br></td>
                                </tr>
                                <tr>
                                    <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Components:<br></td>
                                    <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project[0].components.join(', ')}<br></td>
                                </tr>
                                <tr>
                                    <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Assignee:<br></td>
                                    <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project[0].assignee.join(', ')}<br></td>
                                </tr>
                            </tbody>
                        </table>
                        <p><br></p>
                        </div>
                    `,
            showButton: false,
            showGreeting: false,
            subject: "(ForQAByQA) You have assigned yourself to a project",
            toEmail: req.body.userEmail
        }
    } else {
        mailInfo = {
            intro: `
                        <div>
                        <p><span>You have been assigned to a project by </span><strong><span style="color:#00008b;font-size:1.3rem;">${req.user.username}</span></strong></p>
                        <p><br></p>
                        <p style="text-decoration:underline;">Project Details:</p>
                        <table style="width: 100%;">
                            <tbody>
                                <tr>
                                    <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Title:<br></td>
                                    <td style="width: 87.7486%;padding-top:1rem;padding-right: 2rem;overflow-wrap: anywhere;">${project[0].title}<br></td>
                                </tr>
                                <tr>
                                    <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Description:<br></td>
                                    <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project[0].description}<br></td>
                                </tr>
                                <tr>
                                    <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Components:<br></td>
                                    <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project[0].components.join(', ')}<br></td>
                                </tr>
                                <tr>
                                    <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Assignee:<br></td>
                                    <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project[0].assignee.join(', ')}<br></td>
                                </tr>
                            </tbody>
                        </table>
                        <p><br></p>
                        </div>
                    `,
            showButton: false,
            showGreeting: false,
            outro: "Please contact your admin if you have any questions.",
            subject: "(ForQAByQA) You have been assigned to a project",
            toEmail: req.body.userEmail
        }
    }



    await emailService.mail(mailInfo);
}

export const mailProjectAssigneeRemoved = async (req, project) => {

    let mailInfo;
    //if assign self
    if (req.body.userEmail === req.user.email) {
        mailInfo = {
            intro: `
                 <div>
                 <p>You have remove yourself from a project</p>
                 
                 <p><br></p>
                 <table style="width: 100%;">
                     <tbody>
                         <tr>
                             <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Title:<br></td>
                             <td style="width: 87.7486%;padding-top:1rem;padding-right: 2rem;overflow-wrap: anywhere;">${project[0].title}<br></td>
                         </tr>
                     </tbody>
                 </table>
                 <p><br></p>
                 </div>
             `,
            showButton: false,
            showGreeting: false,
            subject: "(ForQAByQA) You have remove yourself from a project",
            toEmail: req.body.userEmail
        }
    } else {
        mailInfo = {
            intro: `
                 <div>
                 <p><span>You have been removed from a project by </span><strong><span style="color:#00008b;font-size:1.3rem;">${req.user.username}</span></strong></p>
                 <p><br></p>
                 <table style="width: 100%;">
                     <tbody>
                         <tr>
                             <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Title:<br></td>
                             <td style="width: 87.7486%;padding-top:1rem;padding-right: 2rem;overflow-wrap: anywhere;">${project[0].title}<br></td>
                         </tr>
                     </tbody>
                 </table>
                 <p><br></p>
                 </div>
             `,
            showButton: false,
            showGreeting: false,
            outro: "Please contact your admin if you have any questions.",
            subject: "(ForQAByQA) You have been removed from a project",
            toEmail: req.body.userEmail
        }
    }


    await emailService.mail(mailInfo);
}

export const mailProjectTitleUpdated = async (req, project) => {

    let changeMsgSelf;
    let changeSubjectSelf;
    let changeMsgOther;
    let changeSubjectOther;

    if (req.body.newTitle) {
        changeSubjectSelf = `(ForQAByQA) You have changed project title`
        changeSubjectOther = `(ForQAByQA) A project title have been changed`
    } else if (req.body.newDescription) {
        changeSubjectSelf = "(ForQAByQA) You have changed project description"
        changeSubjectOther = `(ForQAByQA) A project description have been changed`
    }

    if (req.body.newTitle) {
        changeMsgSelf = `<p>Project title changed: 
                <span style="color:#fc7276;text-decoration: line-through;">${req.body.oldTitle}</span> to 
                <span style="color:#1ae155;">${req.body.newTitle}</span></p>`
        changeMsgOther = `<p><strong><span style="color:#00008b;font-size:1.3rem;">${req.user.username}</span></strong>
                <span> have changed project's title</span>
                <span style="color:#fc7276;text-decoration: line-through;">${req.body.oldTitle}</span> to 
                <span style="color:#1ae155;">${req.body.newTitle}</span></p>`
    } else if (req.body.newDescription) {
        changeMsgSelf = `<p>Project description changed: 
                <span style="color:#fc7276;text-decoration: line-through;">${project.oldDescription}</span> to 
                <span style="color:#1ae155;">${req.body.newDescription}</span></p>`
        changeMsgOther = `<p><strong><span style="color:#00008b;font-size:1.3rem;">${req.user.username}</span></strong>
                <span> have changed project's description</span>
                <span style="color:#fc7276;text-decoration: line-through;">${project.oldDescription}</span> to 
                <span style="color:#1ae155;">${req.body.newDescription}</span></p>`
    }


    //send email
    let mailInfo;

    project.assignee.map(async (email) => {

        if (email === req.user.email) {
            mailInfo = {
                intro: `
                            <div>
                            ${changeMsgSelf}
                            <p><br></p>
                            <p style="text-decoration:underline;">Project Details:</p>
                            <table style="width: 100%;">
                                <tbody>
                                    <tr>
                                        <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Title:<br></td>
                                        <td style="width: 87.7486%;padding-top:1rem;padding-right: 2rem;overflow-wrap: anywhere;">${project.title}<br></td>
                                    </tr>
                                    <tr>
                                        <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Description:<br></td>
                                        <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project.description}<br></td>
                                    </tr>
                                    <tr>
                                        <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Components:<br></td>
                                        <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project.components.join(', ')}<br></td>
                                    </tr>
                                    <tr>
                                        <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Assignee:<br></td>
                                        <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project.assignee.join(', ')}<br></td>
                                    </tr>
                                </tbody>
                            </table>
                            <p><br></p>
                            </div>
                        `,
                showGreeting: false,
                showButton: false,
                // outro: "Please contact your admin if you have any questions.",
                subject: changeSubjectSelf,
                toEmail: email
            }
            await emailService.mail(mailInfo);
        } else {
            mailInfo = {
                intro: `
                            <div>
                            ${changeMsgOther}
                            <p><br></p>
                            <p style="text-decoration:underline;">Project Details:</p>
                            <table style="width: 100%;">
                                <tbody>
                                    <tr>
                                        <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Title:<br></td>
                                        <td style="width: 87.7486%;padding-top:1rem;padding-right: 2rem;overflow-wrap: anywhere;">${project.title}<br></td>
                                    </tr>
                                    <tr>
                                        <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Description:<br></td>
                                        <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project.description}<br></td>
                                    </tr>
                                    <tr>
                                        <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Components:<br></td>
                                        <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project.components.join(', ')}<br></td>
                                    </tr>
                                    <tr>
                                        <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Assignee:<br></td>
                                        <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${project.assignee.join(', ')}<br></td>
                                    </tr>
                                </tbody>
                            </table>
                            <p><br></p>
                            </div>
                        `,
                showGreeting: false,
                showButton: false,
                outro: "Please contact your admin if you have any questions.",
                subject: changeSubjectOther,
                toEmail: email
            }
            await emailService.mail(mailInfo);
        }
    })
}

//Admin user management mail notification
export const mailUserAdded = async (req, createdAccount) => {
    //send a email that account is created

    let mailInfo;

    //send to self
    mailInfo = {
        intro: `<div>
            <p>You have added a new account
            <strong><span style="color:#00008b;font-size:1.3rem;"> ${createdAccount.email}</span></strong></p>
            </p>
            <p>Account creation will be notified by email to the user.<p>
            <p><br></p>
            <p>It is necessary to provide the user with the account credentials so that he or she can login<p>
            </div>
    `,
        showButton: false,
        showGreeting: false,
        subject: "Account created",
        toEmail: req.user.email
    }

    await emailService.mail(mailInfo);


    //send to user
    mailInfo = {
        name: `${createdAccount.firstname} ${createdAccount.lastname}`,
        intro: `<p>A admin have created a account for you.</p>`,
        instructions: `<p>To proceed, please get your account credentials from your admin and log in to change your password.</p>`,
        showButton: true,
        buttonText: "Account validation",
        link: "auth",
        outro: "Please contact your admin if you have any questions.",
        subject: "Welcome to Defect Management(ForQAByQA)",
        toEmail: createdAccount.email
    }

    await emailService.mail(mailInfo);

}

//send a mail to inform user account updated
export const mailUserPicUpdated = async (req,updatedUser) => {
    
    const mailInfo = {
        name: `${updatedUser[0].firstname} ${updatedUser[0].lastname}`,
        intro: "An admin has updated your account's Profile picture.",
        showButton: false,
        outro: "Please contact your admin if you have any questions.",
        subject: "(ForQAByQA) Your account's Profile picture have been updated",
        toEmail: updatedUser[0].email
    }

    await emailService.mail(mailInfo);
}

//send a mail to inform user account updated
export const mailUserFirstNameUpdated = async (req, updatedUser) => {     
     const mailInfo = {
        name: `${updatedUser.firstname} ${updatedUser.lastname}`,
        intro: "An admin has updated your account's First name.",
        showButton: false,
        outro: "Please contact your admin if you have any questions.",
        subject: "(ForQAByQA) Your account's First name have been updated",
        toEmail: updatedUser.email
    }

    await emailService.mail(mailInfo);
}

//send a mail to inform user account updated
export const mailUserLastNameUpdated = async (req, updatedUser) => {
     
     const mailInfo = {
        name: `${updatedUser.firstname} ${updatedUser.lastname}`,
        intro: "An admin has updated your account's Last name.",
        showButton: false,
        outro: "Please contact your admin if you have any questions.",
        subject: "(ForQAByQA) Your account's Last name have been updated",
        toEmail: updatedUser.email
    }

    await emailService.mail(mailInfo);
}

//send a mail to inform user account updated
export const mailUserUserNameUpdated = async (req, updatedUser) => {
     
     const mailInfo = {
        name: `${updatedUser[0].firstname} ${updatedUser[0].lastname}`,
        intro: "An admin has updated your account's Username.",
        showButton: false,
        outro: "Please contact your admin if you have any questions.",
        subject: "(ForQAByQA) Your account's Username have been updated",
        toEmail: updatedUser[0].email
    }

    await emailService.mail(mailInfo);
}

 //send a mail to inform user account updated
export const mailUserPhoneUpdated = async (req, updatedUser) => {
    
     const mailInfo = {
        name: `${updatedUser[0].firstname} ${updatedUser[0].lastname}`,
        intro: "An admin has updated your account's Phone number.",
        showButton: false,
        outro: "Please contact your admin if you have any questions.",
        subject: "(ForQAByQA) Your account's Phone number have been updated",
        toEmail: updatedUser[0].email
    }

    await emailService.mail(mailInfo);
}

//send a mail to inform user account updated
export const mailUserEmailUpdated = async (req, updatedUser) => {
    
    const mailInfo = {
        name: `${updatedUser[0].firstname} ${updatedUser[0].lastname}`,
        intro: "An admin has updated your account's Email.",
        showButton: false,
        outro: "Please contact your admin if you have any questions.",
        subject: "(ForQAByQA) Your account's Email have been updated",
        toEmail: req.body.userNewEmail
    }

    await emailService.mail(mailInfo);
}

//send a mail to inform user account updated
export const mailUserJobTitleUpdated = async (req, updatedUser) => {
    
    const mailInfo = {
        name: `${updatedUser.firstname} ${updatedUser.lastname}`,
        intro: "An admin has updated your account's Job title.",
        showButton: false,
        outro: "Please contact your admin if you have any questions.",
        subject: "(ForQAByQA) Your account's Job title have been updated",
        toEmail: updatedUser.email
    }

    await emailService.mail(mailInfo);
}

//send a mail to inform user account password resetted
export const mailUserPasswordResetted = async (req, updatedUser) => {

    let mailInfo;

    //send to self
    mailInfo = {
        intro: `<div>
            <p>Passwords for 
            <strong><span style="color:#00008b;font-size:1.3rem;"> ${updatedUser[0].email} </span></strong></p>
            have been successfully reset
            </p>
            <p>The user will receive an email notification that their password has been resetted<p>
            <p><br></p>
            <p>It is necessary to provide the user with the new account credentials so that he or she can login<p>
            </div>
    `,
        showButton: false,
        showGreeting: false,
        subject: "",
        toEmail: req.user.email
    }

    await emailService.mail(mailInfo);


    //send to user
    mailInfo = {
        name: `${updatedUser[0].firstname} ${updatedUser[0].lastname}`,
        intro: `<p>Your account password has been reset by an admin</p>`,
        instructions: `<p>To proceed, please get your account credentials from your admin and log in to change your password.</p>`,
        showButton: true,
        buttonText: "Account validation",
        link: "auth",
        outro: "Please contact your admin if you have any questions.",
        subject: "Welcome to Defect Management(ForQAByQA)",
        toEmail: updatedUser[0].email
    }

    await emailService.mail(mailInfo);
     
}

 //send a mail to inform user account role updated
export const mailUserRoleUpdated = async (req, updatedUser) => {
   
    const mailInfo = {
        name: `${updatedUser.firstname} ${updatedUser.lastname}`,
        intro: "An admin have updated your account's Role.",
        showButton: false,
        outro: "Please contact your admin if you have any questions.",
        subject: "(ForQAByQA) Your account's role have been updated",
        toEmail: updatedUser.email
    }

    await emailService.mail(mailInfo);
}

export const mailUserPermissionUpdated = async (req, updatedUser) => {
     //send a mail to inform user account role updated
     const mailInfo = {
        name: `${updatedUser.firstname} ${updatedUser.lastname}`,
        intro: "An admin have updated your account's Permission.",
        showButton: false,
        outro: "Please contact your admin if you have any questions.",
        subject: "(ForQAByQA) Your account's permission have been updated",
        toEmail: updatedUser.email
    }

    await emailService.mail(mailInfo);
}