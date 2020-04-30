const inquirer = require("inquirer");
const mysql = require("mysql2/promise");
const cTable = require("console.table");
const getData = require("./getData.js");

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

async function viewEmployees() {
  const [
    rows,
  ] = await connection.query(`SELECT E1.id, E1.first_name, E1.last_name, title, name AS department, salary, CONCAT( E2.first_name, ' ', E2.last_name) as manager
  FROM employee AS E1
  INNER JOIN role ON E1.role_id = role.id
  INNER JOIN department ON role.department_id = department.id
  LEFT JOIN employee AS E2 ON E2.id = E1.manager_id`);
  console.table(rows);
  await prompt();
}

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
  INNER JOIN role ON E1.role_id = role.id
  INNER JOIN department ON role.department_id = department.id
  LEFT JOIN employee AS E2 ON E2.id = E1.manager_id
  WHERE ?`,
    {
      department_id: departmentId,
    }
  );
  console.table(rows);
  await prompt();
}

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
  INNER JOIN role ON E1.role_id = role.id
  INNER JOIN department ON role.department_id = department.id
  LEFT JOIN employee AS E2 ON E2.id = E1.manager_id
  WHERE E1.manager_id = ${employeeId}`
  );
  console.table(rows);
  await prompt();
}

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

  const employeeId = await getData.getEmployeeId(answer.employee);
  const roleId = await getData.getRoleId(answer.role);

  const [results] = await connection.query("INSERT INTO employee SET ?", {
    first_name: answer.firstName,
    last_name: answer.lastName,
    role_id: roleId,
    manager_id: employeeId,
  });
  await prompt();
}

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

async function viewRoles() {
  const [rows] = await connection.query(`SELECT title AS roles FROM role`);
  console.table(rows);
  await prompt();
}

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

async function viewDepartments() {
  const [rows] = await connection.query(
    `SELECT name AS departments FROM department`
  );
  console.table(rows);
  await prompt();
}

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
  console.table(budgetArray);
  await prompt();
}
