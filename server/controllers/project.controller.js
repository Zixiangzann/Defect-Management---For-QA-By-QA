import httpStatus from "http-status";
import { ApiError } from "../middleware/apiError.js";
import { projectService } from "../services/index.js";
import { defectListOfToBeRemovedComponents, defectListOfToBeRemovedUser } from "../services/project.service.js";
import { emailService } from '../services/index.js';

const projectController = {

    async createProject(req, res, next) {
        try {
            const project = await projectService.createProject(req);

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

            res.json(project)
        } catch (error) {
            next(error)
        }
    },

    async getProjectByTitle(req, res, next) {
        try {
            const title = req.params.title
            const project = await projectService.getProjectByTitle(title);
            res.json(project);
        } catch (error) {
            next(error);
        }
    },
    async getAllProjects(req, res, next) {
        try {
            const projects = await projectService.getAllProjects(req)
            res.json(projects);
        } catch (error) {
            next(error);
        }
    },

    async deleteProjectByTitle(req, res, next) {
        try {
            const projectTitle = req.query.title;
            await projectService.deleteProjectByTitle(projectTitle);
            res.status(httpStatus.OK).json({ [projectTitle]: 'deleted' });
        } catch (error) {
            next(error);
        }
    },

    async updateProjectByTitle(req, res, next) {
        try {
            // const projectTitle = req.query.title;
            const project = await projectService.updateProjectByTitle(req)

            let changeMsgSelf;
            let changeSubjectSelf;
            let changeMsgOther;
            let changeSubjectOther;

            if(req.body.newTitle){
                changeSubjectSelf = `(ForQAByQA) You have changed project title`
                changeSubjectOther = `(ForQAByQA) A project title have been changed`
            }else if(req.body.newDescription){
                changeSubjectSelf = "(ForQAByQA) You have changed project description"
                changeSubjectOther = `(ForQAByQA) A project description have been changed`
            }

            if(req.body.newTitle){
                changeMsgSelf = `<p>Project title changed: 
                <span style="color:#fc7276;text-decoration: line-through;">${req.body.oldTitle}</span> to 
                <span style="color:#1ae155;">${req.body.newTitle}</span></p>`
                changeMsgOther = `<p><strong><span style="color:#00008b;font-size:1.3rem;">${req.user.username}</span></strong>
                <span> have changed project's title</span>
                <span style="color:#fc7276;text-decoration: line-through;">${req.body.oldTitle}</span> to 
                <span style="color:#1ae155;">${req.body.newTitle}</span></p>`
            }else if(req.body.newDescription){
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
                }})
            
            res.json(project);
        } catch (error) {
            next(error)
        }
    },

    async getAllUsersForAssign(req, res, next) {
        try {
            const users = await projectService.getAllUsersForAssign(req)
            res.json(users)
        } catch (error) {
            next(error)
        }
    },

    async assignProject(req, res, next) {
        try {
            const project = await projectService.assignProject(req)

            //send email  

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
                    subject: "(ForQAByQA) You have assigned yourself a project",
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

            res.json(project);
        } catch (error) {
            next(error)
        }
    },

    async removeAssigneeFromProject(req, res, next) {
        try {
            const project = await projectService.removeAssigneeFromProject(req)

            //send email  

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

            res.json(project);
        } catch (error) {
            next(error)
        }
    },

    async defectListOfToBeRemovedUser(req, res, next) {
        try {
            const project = await projectService.defectListOfToBeRemovedUser(req)
            res.json(project);
        } catch (error) {
            next(error)
        }
    },

    async addComponentsToProject(req, res, next) {
        try {
            const project = await projectService.addComponentsToProject(req)

            //send email  

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



            res.json(project);
        } catch (error) {
            next(error)
        }
    },

    async removeComponentsFromProject(req, res, next) {
        try {
            const project = await projectService.removeComponentsFromProject(req)

            //send email  

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


            res.json(project);
        } catch (error) {
            next(error)
        }
    },

    async defectListOfToBeRemovedComponents(req, res, next) {
        try {
            const project = await projectService.defectListOfToBeRemovedComponents(req)
            res.json(project);
        } catch (error) {
            next(error)
        }
    },

    // async projectsListPaginate(req, res, next) {
    //     try {
    //         const projects = await projectService.paginateProjectsList(req)
    //         res.json(projects);
    //     } catch (error) {
    //         next(error);
    //     }
    // },
    // async getMoreProjects(req, res, next) {
    //     try {
    //         const projects = await projectService.getMoreProjects(req);
    //         res.json(projects);
    //     } catch (error) {
    //         next(error);
    //     }
    // }
}

export default projectController;