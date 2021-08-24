**Step 0**

- If not already installed, install node.js from this website: https://nodejs.org/en/download/
- If not already installed, install Git from this website: https://git-scm.com/downloads

**Step 1**

- Clone the following repository to a folder of your choice on your local machine: https://gitlab.stud.idi.ntnu.no/gr10/dcst1008_2021_10 

**Step 2**

- Git bash into the following path in your cloned repository: _dcst1008_2021_10\todo-application_
- run the command _npm install_, this will install all necessary modules and dependencies to run the application on your local machine

**Step 3**

- Insert your mysql username and password to the following files: _.\todo-application\src\mysql-pool.tsx_ & _.\todo-application\src\setup-db.tsx_
- Git bash into the following path: _dcst1008_2021_10\todo-application_
- Run the following command: _node src/setup-db.tsx_, this will create the necessary tables in your database to start and use the application. 

**Step 4**

 - Start the application with the command _npm start_