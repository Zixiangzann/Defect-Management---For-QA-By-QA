import { AccessControl } from "accesscontrol";


const allRights = {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*']
}

let grantsObject = {
    admin: {
        profile:allRights,
        defects:allRights,
        admin: allRights,
        assignee:allRights,
        projects:allRights,
        comments:allRights,
    },
    user: {
        profile:{
        'read:own': ['*','!password','!_id'],
        'update:own': ['*','!password','!_id ,!role']
    },
        defects:{
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
        },
        assignee:{
            'read:any': ['*']
        },
        projects:{
            'read:any':['*']
        },
        comments:{
            'create:any':['*'],
            'read:any':['*'],
        }
    }
};

const roles = new AccessControl(grantsObject);

export default roles