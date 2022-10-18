import { AccessControl } from "accesscontrol";


const allRights = {
    'create:any': ['*'],
    'read:any': ['*'],
    'update:any': ['*'],
    'delete:any': ['*']
}

let grantsObject = {
    owner:{
        profile:allRights,
        defects:allRights,
        admin: allRights,
        assignee:allRights,
        projects:allRights,
        comments:allRights,
        history: allRights,
        watchlist:{
            'read:own':['*'],
            'update:own':['*']

        }
    },
    admin: {
        profile:allRights,
        defects:allRights,
        admin: allRights,
        assignee:allRights,
        projects:allRights,
        comments:allRights,
        history: allRights,
        watchlist:{
            'read:own':['*'],
            'update:own':['*']

        }
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
            'delete:any':['*'],
        },
        history:{
            'create:any':['*'],
            'read:any':['*']
        },
        watchlist:{
            'read:own':['*'],
            'update:own':['*']

        }
    }
};

const roles = new AccessControl(grantsObject);

export default roles