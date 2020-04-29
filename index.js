const inquirer = require("inquirer");
const mysql = require("mysql2/promise");

let connection;

main();

async function main() {
  try {
    await connect();
    await prompt();
  } catch (error) {
    console.log(error);
  } finally {
    connection.end();
  }
}

async function connect() {
  connection = await mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "hyeonmi91",
    database: "employee_trackerDB",
  });
  console.log("connected as id " + connection.threadId);
}

let starterQuestion = {
  name: "action",
  type: "list",
  message: "What would you like to do?",
  choices: [
    "View all Employees",
    "View All Employees By Department",
    "View All Employees By Manager",
    "Add Employee",
    "Remove Employee",
    "Update Employee Role",
    "Update Employee Manager",
    "View all Roles",
    "Add a Role",
    "Remove a Role",
    "View all Departments",
    "View utilized Budget",
    "Add a Department",
    "Remove a Department",
  ],
};

async function prompt() {
  const answer = await inquirer.prompt(starterQuestion);
}
