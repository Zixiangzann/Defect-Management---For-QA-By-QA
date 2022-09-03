import httpStatus from "http-status";
import { ApiError } from "../middleware/apiError.js";
import { projectService } from "../services/index.js";

const projectController = {

    async createProject(req, res, next) {
        try {
            const project = await projectService.createProject(req.body);
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
            const projectTitle = req.query.title;
            const project = await projectService.updateProjectByTitle(projectTitle, req.body)
            res.json(project);
        } catch (error) {
            next(error)
        }
    },

    async assignProject(req, res, next) {
        try {
            const projectTitle = req.query.title;
            const project = await projectService.assignProject(projectTitle, req.body.email)
            res.json(project);
        } catch (error) {
            next(error)
        }
    },
    
    async addComponentsToProject(req, res, next) {
        try {
            const projectTitle = req.query.title;
            const project = await projectService.addComponentsToProject(projectTitle, req.body.components)
            res.json(project);
        } catch (error) {
            next(error)
        }
    },

    async projectsListPaginate(req, res, next) {
        try {
            const projects = await projectService.paginateProjectsList(req)
            res.json(projects);
        } catch (error) {
            next(error);
        }
    },
    async getMoreProjects(req, res, next) {
        try {
            const projects = await projectService.getMoreProjects(req);
            res.json(projects);
        } catch (error) {
            next(error);
        }
    }
}

export default projectController;