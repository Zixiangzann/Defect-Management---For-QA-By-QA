import * as Yup from 'yup';

export const formValues = {
    title:'',
    description:'',
    project:'',
    components:'',
    server:'',
    issuetype:'',
    severity:'',
    status:'',
    assignee:'',
    assigneeDetails: '',
}

export const validation = () => (
    Yup.object({
        title:Yup.string().required('Title is required'),
        description: Yup.string().min(50,'Type more details..'),
        project:Yup.string().required('Please select a Project'),
        components:Yup.string().required('Please select Components'),
        server:Yup.string().required('Please select Server'),
        issuetype: Yup.string().required('Please select Issue Type'),
        severity: Yup.string().required('Please select Severity'),
        status: Yup.string(),
        assignee: Yup.array().required('Please Select Assignee')
    }));