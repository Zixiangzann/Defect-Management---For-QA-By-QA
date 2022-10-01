import httpStatus from 'http-status';
import { updateAttachment, countIssueType } from '../services/defect.service.js';
import { defectService } from '../services/index.js';
import { emailService } from '../services/index.js';

const defectController = {

    async createDefect(req, res, next) {
        try {
            const defect = await defectService.createDefect(req.body, req.user);

            let mailInfo;

            //send email
            //send to reporter
            mailInfo = {
                intro: `
                    <div>
                    <p>You have created a new defect and assigned to
                    <p><br></p>
                    <span style="color:#9c27b0;"> ${defect.assignee.join(', ')}</span>
                    <p><br></p>
                    <p style="text-decoration:underline;">Defect Details:</p>
                    <table style="width: 100%;">
                        <tbody>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Defect ID:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;padding-right: 2rem;overflow-wrap: anywhere;">${defect.defectid}<br></td>
                            </tr>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Title:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${defect.title}<br></td>
                            </tr>
                            <tr>
                            <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Issue Type:<br></td>
                            <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${defect.issuetype}<br></td>
                        </tr>
                            <tr>
                            <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Severity:<br></td>
                            <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${defect.severity}<br></td>
                        </tr>
                        <tr>
                            <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Status:<br></td>
                            <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${defect.status}<br></td>
                        </tr>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Project:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${defect.project}<br></td>
                            </tr>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Component:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${defect.components}<br></td>
                            </tr>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Server:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${defect.server}<br></td>
                            </tr>
   
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Assignee:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${defect.assignee.join(', ')}<br></td>
                            </tr>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Reporter:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${defect.reporter}<br></td>
                            </tr>
                            <tr>
                                <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Created Date:<br></td>
                                <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${defect.createdDate}<br></td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                    <div>
                    <p style="color:#0000cd;padding-top:1rem;padding-right: 2rem;">Description:</p>
                    <div>${(defect.description).replace(/&lt;/g,"<").replace(/&nbsp;/g," ")}</div>
                    <p><br></p>
                    </div>
                `,
                showGreeting: false,
                showButton: true,
                instruction: "Click here to view defect",
                buttonText: "View Defect",
                link: `defect/view/${defect.defectid}`,
                subject: `(ForQAByQA) New Defect created`,
                toEmail: req.user.email
            }
            await emailService.mail(mailInfo);


            //send to all assignee except for user who created the project
            defect.assignee.map(async (email) => {
                if (email !== req.user.email) {
                    mailInfo = {
                        intro: `
                            <div>
                            <p><span style="color:#9c27b0;">${defect.reporter}</span> have created a new defect assigned to you
                            <p><br></p>
                            <p style="text-decoration:underline;">Defect Details:</p>
                            <table style="width: 100%;">
                                <tbody>
                                    <tr>
                                        <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Defect ID:<br></td>
                                        <td style="width: 87.7486%;padding-top:1rem;padding-right: 2rem;overflow-wrap: anywhere;">${defect.defectid}<br></td>
                                    </tr>
                                    <tr>
                                        <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Title:<br></td>
                                        <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${defect.title}<br></td>
                                    </tr>
                                    <tr>
                                    <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Issue Type:<br></td>
                                    <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${defect.issuetype}<br></td>
                                </tr>
                                    <tr>
                                    <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Severity:<br></td>
                                    <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${defect.severity}<br></td>
                                </tr>
                                <tr>
                                    <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Status:<br></td>
                                    <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${defect.status}<br></td>
                                </tr>
                                    <tr>
                                        <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Project:<br></td>
                                        <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${defect.project}<br></td>
                                    </tr>
                                    <tr>
                                        <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Component:<br></td>
                                        <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${defect.components}<br></td>
                                    </tr>
                                    <tr>
                                        <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Server:<br></td>
                                        <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${defect.server}<br></td>
                                    </tr>
           
                                    <tr>
                                        <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Assignee:<br></td>
                                        <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${defect.assignee.join(', ')}<br></td>
                                    </tr>
                                    <tr>
                                        <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Reporter:<br></td>
                                        <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${defect.reporter}<br></td>
                                    </tr>
                                    <tr>
                                        <td style="width: 12.1348%;color:#0000cd;padding-top:1rem;padding-right: 2rem;">Created Date:<br></td>
                                        <td style="width: 87.7486%;padding-top:1rem;overflow-wrap: anywhere;">${defect.createdDate}<br></td>
                                    </tr>
                                </tbody>
                            </table>
                            </div>
                            <div>
                            <p style="color:#0000cd;padding-top:1rem;padding-right: 2rem;">Description:</p>
                            <div>${(defect.description).replace(/&lt;/g,"<").replace(/&nbsp;/g," ")}<div>
                            <p><br></p>
                            </div>
                        `,
                        showGreeting: false,
                        showButton: true,
                        instruction: "Click here to view defect",
                        buttonText: "View Defect",
                        link: `defect/view/${defect.defectid}`,
                        subject: `(ForQAByQA) ${defect.reporter} have created a new defect and assigned to you`,
                        toEmail: email
                    }
                    await emailService.mail(mailInfo);
                }
            })


            res.json(defect)
        } catch (error) {
            next(error)
        }
    },
    async updateAttachment(req, res, next) {
        try {
            const defectId = req.params.defectId
            const addAttachment = await defectService.updateAttachment(defectId, req.user, req.body)
            res.json(addAttachment)
        } catch (error) {
            next(error)
        }
    },
    async getDefectById(req, res, next) {
        try {
            const defectId = req.params.defectId
            const defect = await defectService.getDefectById(defectId, req.user);
            res.json(defect);
        } catch (error) {
            next(error);
        }
    },
    async updateDefectById(req, res, next) {
        try {
            const defectId = req.params.defectId;
            const defect = await defectService.updateDefectById(defectId, req.user, req.body);

            //send email
            //You have edited a defect, click to view defect
            //xxxxxxx have edited a defect that you are assigned to/watching. 

            res.json(defect);
        } catch (error) {
            next(error);
        }
    },
    async deleteDefectById(req, res, next) {
        try {
            const defectId = req.params.defectId;
            await defectService.deleteDefectById(defectId, req.user);

            //send email
            //You have deleted a defect
            //xxxxxxx have deleted a defect that you are assigned to/watching. 


            res.status(httpStatus.OK).json({ [defectId]: 'deleted' });
        } catch (error) {
            next(error);
        }
    },

    //For more
    async getMoreDefects(req, res, next) {
        try {
            const defects = await defectService.getMoreDefects(req, req.user);
            res.json(defects);
        } catch (error) {
            next(error);
        }
    },
    async defectListPaginate(req, res, next) {
        try {
            const defects = await defectService.paginateDefectList(req, req.user);
            res.json(defects);
        } catch (error) {
            next(error);
        }
    },
    //Get details for creating defects
    async getAllAssignee(req, res, next) {
        try {
            const assignee = await defectService.getAllAssignee(req.body.title);
            res.json(assignee);
        } catch (error) {
            next(error);
        }
    },
    async getAllProjects(req, res, next) {
        try {
            const projects = await defectService.getAllProjects(req.user);
            res.json(projects)
        } catch (error) {
            next(error);
        }
    },
    async getAllComponents(req, res, next) {
        try {
            const components = await defectService.getAllComponents(req.body.title);
            res.json(components);
        } catch (error) {
            next(error)
        }
    },
    async filterDefectList(req, res, next) {
        try {
            const defects = await defectService.filterDefectList(req, req.user);
            res.json(defects);
        } catch (error) {
            next(error);
        }
    },
    //for generate report
    async countSeverity(req, res, next) {
        try {
            const defects = await defectService.countSeverity(req, req.user);
            res.json(defects);
        } catch (error) {
            next(error);
        }
    },

    async countStatus(req, res, next) {
        try {
            const defects = await defectService.countStatus(req, req.user);
            res.json(defects);
        } catch (error) {
            next(error);
        }
    },

    async countIssueType(req, res, next) {
        try {
            const defects = await defectService.countIssueType(req, req.user);
            res.json(defects);
        } catch (error) {
            next(error);
        }
    },

    async countServer(req, res, next) {
        try {
            const defects = await defectService.countServer(req, req.user);
            res.json(defects);
        } catch (error) {
            next(error);
        }
    },
    async countComponents(req, res, next) {
        try {
            const defects = await defectService.countComponents(req, req.user);
            res.json(defects);
        } catch (error) {
            next(error);
        }
    },
}

export default defectController;