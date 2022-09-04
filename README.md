# Defect-Management---For QA By QA

A Defect Management system created by QA for QA.

Motivation:
As a QA I always wanted to create my own defect management system.

Functionality:
- Defect Tracking 
- Generate Project Report
- Project Management 
- Account Management

Defect Tracking
- Purpose: track defects
- can:
Create Defect with details 
(Title, Description, Project, Components, Issue type, Severity, Server, Assignee, File attachment)

Edit Defect details 
(Change Title, Description, Project,Status,Components, Issue type, Severity, Server, Assignee, File attachment)

Delete Defect
(Deletion of Defect, cannot be recovered)

View Defect details 
(Preview files attachment(Support preview of file type: Image, Audio, Video , Text), Download attachment)


Generate Reports 

Purpose: Generate project report for easy viewing on project defects

Can: 

Generate project reports on filter such as
- Project 
- Defect Status
- Defect Severity 
- Components 
- Issue Type 
- Server

Report can be download as PDF

Supported chart type: Pie,Bar,Table


User Management 

*only owner, admin account can access*
Purpose: View and manage user account 
can: 
- View and update user details such as 
- User Details (firstname, lastname, username, email, job title)
- Reset account password
- Change account role
- View and manage user project
- Change user accounts permissions 

Actions in User Management require permissions/account role depending on the type of action (example to change account role, the account that you are using must be a *owner* account and to reset password, you must have *resetPassword* permissions , refer to Permissions section for more details.

Project Management (Not done)

can:
- Create project with details 
(Title, Description, Components, Assignee)
- Delete project
- Edit Project
(Title, Description, Components, Assignee)
- View Project details

Account Permission

Standard User permission

(Account role that can have these permission: User,Admin,Owner)

- addDefect: (permission to create defect)  
- editOwnDefect: (permission to edit own defect)
- editAllDefect:(permission to edit all defects if the project is assigned to the account)
- addComment: (permission to add comment)  
- editOwnComment: (permission to edit own comment)
- deleteOwnComment:  (permission to delete own comment)

Owner/Admin permission 

(Account role that can have these permission: Admin,Owner)

Defect Management 

- viewAllDefects: (permission to view all defects including project that are not assigned to the account)
- deleteAllDefect: (permission to delete all defects including project that are not assigned to the account)
- editAllComment: (permission to edit all comments)
- deleteAllComment: (permission to delete all comments)

Account Management 

- addUser: (permission to add new account.)
Admin/Owner account can only be created by Account role that is *Owner*)
- disableUser: (permission to ban account from accessing)
- deleteUser: (permission to delete a account)
- changeUserDetails: (permission to change account details such as first name, last name, email, username, jobtitle)
- resetUserPassword: (permission to reset user password)

Project Management 

- addProject: (permission to add new project)
- assignProject: (permission to assign account to a project)
- deleteProject: (permission to delete a project)
- addComponent: (permission to add component to project)
- deleteComponent: (permission to delete component from project)


To Do List

Functionality 
- Project Management implementation 
- Home Page( To be fill with User stats) 
- Task implementation (like user story or project to do list)

Non-function 
- proper documentation. (including on how to host this project on your own)
- Host this project on heroku and let people who are interested to try using this)
- Find people who are interested to join me in implementing this system (Non-profit as this project is meant to be free to use)


