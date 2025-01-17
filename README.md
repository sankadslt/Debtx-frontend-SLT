# Debtx-frontend-SLT
A web application frontend for managing debt recovery SLT side, built with the MERN stack (MongoDB, Express.js, React, Node.js,tailwind).

## Project Git Workflow Guide

This document outlines the Git branching strategy, naming conventions, and instructions for developers contributing to the project. Following this workflow ensures a smooth and efficient development process across the team.

## Git Branching Strategy

This project follows a **Git Flow** branching strategy to manage development and track contributions.

### Branch Structure

1. **main**  
   - The production branch containing stable and tested code ready for deployment.

2. **dev**  
   - The integration branch where all completed features from different teams are merged before they are released.

3. **UIName-UINO/**  
   - Each team works on a specific feature in separate branches, created from `develop` and merged back into `develop` once complete.





## Branch Naming Conventions

To maintain clarity and organization, follow the naming conventions below:

### 1. Team Feature Branches
Each team will have a main team feature branch for their area of the project. Example branches:
- `IncidentList-1.1`



  

  ## Frontend develpment Guide

### 1. Review the prototype:
#### Developer can review the common template structures. <text-box,submit-button, ect...>
      /prototypeA
      /prototypeB
      /prototypeC
   

### 2. This is the comment structure. you have to add comments like this, to the top of all the development files.
#### example :
    Purpose: This template is used for the agent registration page.
    Created Date: 2024-11-19
    Created By: Your Name (your mail)
    Last Modified Date: 2024-12-01
    Modified By: Your Name (your mail)
    Version: node 11
    ui number : v1.0.1
    Dependencies: tailwind css
    Related Files: register.js (drc), settlement.js (log), app.js (routes)
    Notes: This template uses a tailwind css form for the registration fields. 

## Workflow

### Step 1: Clone the Repository
To start working on the project, clone the repository:
```bash
git clone https://github.com/sankadslt/debt-recovery-frontend.git
```

### Step 2: Create a Feature Branch
After cloning the repository, switch to the `develop` branch and create a new branch for your task:
```bash
git checkout develop
git pull origin develop  # Ensure your local develop branch is up to date
git checkout -b <team-number>/<developer-name>
```


### Step 3: Work on Your Task
Make changes and commit them to your individual branch. Each commit should focus on a single task or feature.
```bash
git add .  # Add changed files
git commit -m "Add login API integration"
git push origin <team-number>/<developer-name>
```

### Step 4: Create a Pull Request (PR)
Once your task is complete, create a pull request (PR) to merge your individual branch into the team's feature branch.

1. Go to the repository on GitHub.
2. Navigate to the Pull Requests section.
3. Click "New Pull Request".
4. Set the base branch to the team’s feature branch (e.g., `team1`).
5. Set your branch (e.g., `team1/sachin`) as the compare branch.
6. Provide a clear description of your changes and reference the ui number 
7. Request a code review from a  team lead.

### Step 5: Code Review and Merge
Once the pull request has been reviewed and approved team lead, it will be merged into the main team feature branch. After the merge:
- Developers should pull the latest changes from the team feature branch to keep their local branches up to date.

### Step 6: Final Merge to develop - important notice for team leaders 
When all features for a specific part are complete and merged into the main team feature branch, the team lead will create a PR from the team feature branch to `develop`.
It review by repo lead and after merge


## Git Best Practices

- **Write Descriptive Commit Messages**: Each commit should briefly describe what changes were made.
- **Rebase or Merge Regularly**: Keep individual branches up to date by regularly rebasing or merging `develop` into your branch to avoid conflicts.
- **Create Small, Focused Pull Requests**: Break down changes into smaller, focused pull requests to make them easier to review.
- **Resolve Merge Conflicts Quickly**: Resolve any merge conflicts as soon as possible to avoid blocking the team’s progress.

.

## Important Notes

- **Protected Branches**: Both `main` and `develop` are protected. Do not push directly to these branches; all changes must go through a pull request.
- **Code Reviews**: Every pull request should be reviewed by at team leader before merging.
- **Communication**: Maintain regular communication with your team through GitHub Issues, PR comments, or your preferred team chat platform.

## Example Folder Structure

Here’s an example of how the repository might be structured:

```
main
  └── develop
         ├── UIname1-UINo1
         │    
         │    
         ├── UIname2-UINo2
             
        
```

By following this workflow, the development process remains organized, efficient, and collaborative. 
```


