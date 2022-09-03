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


To Do
- Update proper documentation with screenshots and update permissions section.
- Project Management implementation 
- Home Page( To be fill with User stats) 


