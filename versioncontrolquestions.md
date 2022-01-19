1. Write in details the steps for pushing your code to an online Git repository to a branch named "TaskBranch" given that the branch is not created yet.

- git init
- git add .
- git status
- git commit -m 'message'
- git remote add origin 'repo_url'
- git checkout -b TaskBranch
- git push origin TaskBranch

2. Write in details how to merge branch "Task-Branch" with branch "Master".

- git checkout Master
- git merge Task-Branch


3. Write in details how to check the local changes that were done on branch "Task-Branch"

- git checkout Task-Branch
- git status



