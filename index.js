// Define node modules
const inquirer = require("inquirer");
const mysql = require("mysql2/promise");
const cTable = require("console.table");

// Get access to getData functions module
const getData = require("./modules/getData.js");

// This is a inquirer question for the user to choose what they want to do
const starterQuestion = {
  name: "action",
  type: "list",
  message: "What would you like to do?",
  choices: [
    "Exit",
    "View all Employees",
    "View all Employees By Department",
    "View all Employees By Manager",
    "Add Employee",
    "Remove Employee",
    "Update Employee Role",
    "Update Employee Manager",
    "View all Roles",
    "Add a Role",
    "Remove a Role",
    "View all Departments",
    "Add a Department",
    "Remove a Department",
    "View the Total Utilized Budget of a Department",
  ],
};

// Calling the main async function
main();

// This function connects to the database then prompts the user what they want to do
// It catches any errors and terminates the connection if afterwards
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

// This function connects to the database with the provided information
// It then prints out that it is connected
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

// This function prompts the user the starterquestion and based on their response a particular function is called
async function prompt() {
  const answer = await inquirer.prompt(starterQuestion);
  switch (answer.action) {
    case "Exit":
      break;
    case "View all Employees":
      await viewEmployees();
      break;
    case "View all Employees By Department":
      await viewEmployeesByDepartment();
      break;
    case "View all Employees By Manager":
      await viewEmployeesByManager();
      break;
    case "Add Employee":
      await addEmployee();
      break;
    case "Remove Employee":
      await removeEmployee();
      break;
    case "Update Employee Role":
      await updateEmployeeRole();
      break;
    case "Update Employee Manager":
      await updateEmployeeManager();
      break;
    case "View all Roles":
      await viewRoles();
      break;
    case "Add a Role":
      await addRole();
      break;
    case "Remove a Role":
      await removeRole();
      break;
    case "View all Departments":
      await viewDepartments();
      break;
    case "Add a Department":
      await addDepartment();
      break;
    case "Remove a Department":
      await removeDepartment();
      break;
    case "View the Total Utilized Budget of a Department":
      await utilizedBudget();
      break;
  }
}

// This is a function to display all of the employees with their properties
// It selects data from 3 different tables in the database and joins the three tables (employees, role, department)
// It then prints the data in an organized table
async function viewEmployees() {
  const [
    rows,
  ] = await connection.query(`SELECT E1.id, E1.first_name, E1.last_name, title, name AS department, salary, CONCAT( E2.first_name, ' ', E2.last_name) as manager
  FROM employee AS E1
  LEFT JOIN role ON E1.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee AS E2 ON E2.id = E1.manager_id`);
  console.log("\n\n");
  console.table(rows);
  console.log("\n\n");
  await prompt();
}

// This function displays all the employees in a given department chosen by the user
// It joins data from three tables (employees, role and department)
// It prints the data in a table
async function viewEmployeesByDepartment() {
  const departments = await getData.getDepartments();
  const answer = await inquirer.prompt({
    name: "department",
    message: "Which department would you like to view?",
    type: "list",
    choices: departments,
  });
  const departmentId = await getData.getDepartmentId(answer.department);
  const [rows] = await connection.query(
    `SELECT CONCAT(E1.first_name, ' ', E1.last_name) as employee, title, salary, CONCAT( E2.first_name, ' ', E2.last_name) as manager
  FROM employee AS E1
  LEFT JOIN role ON E1.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee AS E2 ON E2.id = E1.manager_id
  WHERE ?`,
    {
      department_id: departmentId,
    }
  );
  console.log("\n\n");
  console.table(rows);
  console.log("\n\n");
  await prompt();
}

// This function displays all the employees that work for a manager chosen by the user
// It joins data from three tables (employees, role and department)
// It prints the data in a table
async function viewEmployeesByManager() {
  const managers = await getData.getNames();
  const answer = await inquirer.prompt({
    name: "manager",
    message: "Which manager's employees do you want to view?",
    type: "list",
    choices: managers,
  });
  const employeeId = await getData.getEmployeeId(answer.manager);
  const [rows] = await connection.query(
    `SELECT  CONCAT( E1.first_name, ' ', E1.last_name) as employee, name AS department, title, salary
  FROM employee AS E1
  LEFT JOIN role ON E1.role_id = role.id
  LEFT JOIN department ON role.department_id = department.id
  LEFT JOIN employee AS E2 ON E2.id = E1.manager_id
  WHERE E1.manager_id = ${employeeId}`
  );
  console.log("\n\n");
  console.table(rows);
  console.log("\n\n");
  await prompt();
}

// This function allows the user to add an employee into the employee table
// They are prompted with questions regarding the employee
// The data is stored in the mysql database
async function addEmployee() {
  const names = await getData.getNames();
  const roles = await getData.getRoles();

  const answer = await inquirer.prompt([
    {
      name: "firstName",
      message: "What is the employee's first name?",
    },
    {
      name: "lastName",
      message: "What is the employee's last name?",
    },
    {
      name: "role",
      message: "What is the employees's role?",
      type: "list",
      choices: roles,
    },
    {
      name: "employee",
      message: "Who is the employee's manager?",
      type: "list",
      choices: names,
    },
  ]);

  let employeeId;

  if (answer.employee === "None") {
    employeeId = null;
  } else {
    employeeId = await getData.getEmployeeId(answer.employee);
  }

  const roleId = await getData.getRoleId(answer.role);

  const [results] = await connection.query("INSERT INTO employee SET ?", {
    first_name: answer.firstName,
    last_name: answer.lastName,
    role_id: roleId,
    manager_id: employeeId,
  });
  await prompt();
}

// This function allows the user to remove an employee from the employee table
// They are prompted with the a question regarding what employee they want to remove
// The data is stored in the mysql database
async function removeEmployee() {
  const names = await getData.getNames();
  const answer = await inquirer.prompt({
    name: "employee",
    message: "Which employee do you want to remove?",
    type: "list",
    choices: names,
  });
  const employeeId = await getData.getEmployeeId(answer.employee);

  const [results] = await connection.query("DELETE FROM employee WHERE ?", {
    id: employeeId,
  });
  await prompt();
}

// This function allows the user to update an employee's current role
// They are prompted with questions about the employee and role
// The updated employee is stored in the database
async function updateEmployeeRole() {
  const names = await getData.getNames();
  const roles = await getData.getRoles();
  const answer = await inquirer.prompt([
    {
      name: "employee",
      message: "Which employee do you want to update?",
      type: "list",
      choices: names,
    },
    {
      name: "role",
      message: "What is their new role?",
      type: "list",
      choices: roles,
    },
  ]);
  const roleId = await getData.getRoleId(answer.role);
  const employeeId = await getData.getEmployeeId(answer.employee);

  const [results] = await connection.query(`UPDATE employee SET ? WHERE ?`, [
    {
      role_id: roleId,
    },
    {
      id: employeeId,
    },
  ]);
  await prompt();
}

// This function allows the user to update an employee's manager
// They are prompted with questions about the employee and manager
// The updated employee is stored in the database
async function updateEmployeeManager() {
  const names = await getData.getNames();

  const answer = await inquirer.prompt([
    {
      name: "employee",
      message: "Which employee do you want to update?",
      type: "list",
      choices: names,
    },
    {
      name: "manager",
      message: "What is their new manager?",
      type: "list",
      choices: names,
    },
  ]);
  const employeeId = await getData.getEmployeeId(answer.employee);
  const managerId = await getData.getEmployeeId(answer.manager);

  const [results] = await connection.query(`UPDATE employee SET ? WHERE ?`, [
    {
      manager_id: managerId,
    },
    {
      id: employeeId,
    },
  ]);
  await prompt();
}

// This function allows the user to view the existing roles in the database
// The data is displayed as a table in the terminal
async function viewRoles() {
  const [rows] = await connection.query(`SELECT title AS roles FROM role`);
  console.log("\n\n");
  console.table(rows);
  console.log("\n\n");
  await prompt();
}

// This function allows the user to add a role to the roles table
// They are prompted with questions regarding the role
// The data is stored in the database
async function addRole() {
  const departments = await getData.getDepartments();
  const answer = await inquirer.prompt([
    {
      name: "newRole",
      message: "What is the new role you want to add?",
    },
    {
      name: "salary",
      message: "What is the salary for this role?",
    },
    {
      name: "department",
      message: "Which department does this role belong to?",
      type: "list",
      choices: departments,
    },
  ]);
  const departmentId = await getData.getDepartmentId(answer.department);

  const [results] = await connection.query("INSERT INTO role SET ?", {
    title: answer.newRole,
    salary: answer.salary,
    department_id: departmentId,
  });
  await prompt();
}

// This function allows theuser to remove an existing role from the database
// They are prompted with the role that they want to remove
async function removeRole() {
  const roles = await getData.getRoles();
  const answer = await inquirer.prompt({
    name: "role",
    message: "Which role do you want to remove?",
    type: "list",
    choices: roles,
  });
  const roleId = await getData.getRoleId(answer.role);

  const [results] = await connection.query("DELETE FROM role WHERE ?", {
    id: roleId,
  });
  await prompt();
}

// This function allows the user to view all of the existing departments
// It selects the department names and displays them into a table
async function viewDepartments() {
  const [rows] = await connection.query(
    `SELECT name AS departments FROM department`
  );
  console.log("\n\n");
  console.table(rows);
  console.log("\n\n");
  await prompt();
}

// This function allows the user to add a new department into the database
// The user is prompted with the name of the department that they wish to add
async function addDepartment() {
  const answer = await inquirer.prompt({
    name: "newDepartment",
    message: "What is the name of the new department?",
  });
  const [results] = await connection.query("INSERT INTO department SET ?", {
    name: answer.newDepartment,
  });
  await prompt();
}

// This function lets the user remove an existing department from the database
// They are asked which department that they want to remove
async function removeDepartment() {
  const departments = await getData.getDepartments();
  const answer = await inquirer.prompt({
    name: "department",
    message: "Which department do you want to remove?",
    type: "list",
    choices: departments,
  });
  const departmentId = await getData.getDepartmentId(answer.department);
  const [results] = await connection.query("DELETE FROM department WHERE ?", {
    id: departmentId,
  });
  await prompt();
}

// This function prints out a table with the total utilized budget for a given department
// The user is asked which department that they want to see
async function utilizedBudget() {
  const departments = await getData.getDepartments();
  const answer = await inquirer.prompt({
    name: "department",
    message: "Which department's utilized budget would you like to view?",
    type: "list",
    choices: departments,
  });
  const departmentId = await getData.getDepartmentId(answer.department);
  const [employeeSalaries] = await connection.query(
    `SELECT salary FROM role WHERE?`,
    {
      department_id: departmentId,
    }
  );
  let sum = 0;
  employeeSalaries.forEach((item) => {
    sum += parseInt(item.salary);
  });
  let budgetArray = [
    { department: answer.department, total_utilized_budget: sum },
  ];
  console.log("\n\n");
  console.table(budgetArray);
  console.log("\n\n");
  await prompt();
}
