const inquirer = require("inquirer");
const mysql = require("mysql2/promise");
const cTable = require("console.table");

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
    "View utilized Budget",
    "Add a Department",
    "Remove a Department",
    "View the Total Utilized Budget of a Department",
  ],
};

async function getNames() {
  const [namesData] = await connection.query(
    `SELECT first_name, last_name FROM employee`
  );
  const names = ["None"];
  namesData.forEach((element) => {
    let name = `${element.first_name} ${element.last_name}`;
    names.push(name);
  });
  return names;
}

async function getRoles() {
  const [rolesData] = await connection.query(`SELECT title FROM role`);
  const roles = [];
  rolesData.forEach((element) => {
    roles.push(element.title);
  });
  return roles;
}

async function getDepartments() {
  const [departmentsData] = await connection.query(
    `SELECT department FROM department`
  );
  const departments = [];
  departmentsData.forEach((element) => {
    departments.push(element.department);
  });
  return departments;
}

async function getEmployeeId(name) {
  const splitName = name.split(" ");
  const firstName = splitName[0];
  const lastName = splitName[1];

  const [employeeIdData] = await connection.query(
    "SELECT id FROM employee WHERE ? AND ?",
    [
      {
        first_name: firstName,
      },
      {
        last_name: lastName,
      },
    ]
  );
  return employeeIdData[0].id;
}

async function getRoleId(role) {
  const [roleIdData] = await connection.query("SELECT id FROM role WHERE ?", {
    title: role,
  });
  return roleIdData[0].id;
}

async function getDepartmentId(department) {
  const [departmentIdData] = await connection.query(
    "SELECT id FROM department WHERE ?",
    {
      department: department,
    }
  );
  return departmentIdData[0].id;
}

async function prompt() {
  const answer = await inquirer.prompt(starterQuestion);
  switch (answer.action) {
    case "View all Employees":
      await viewEmployees();
      break;
    case "View all Employees By Department":
      break;
    case "View all Employees By Manager":
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
      break;
  }
}

async function viewEmployees() {
  const [
    rows,
  ] = await connection.query(`SELECT employee.id, first_name, last_name, title, department, salary, manager_id
  FROM employee
  INNER JOIN role ON employee.role_id = role.id
  INNER JOIN department ON role.department_id = department.id;`);
  console.table(rows);
  await prompt();
}

async function viewEmployeesByDepartment() {
  const [rows] = await connection.query;
}

async function viewEmployeesByManager() {}

async function addEmployee() {
  const names = await getNames();
  const roles = await getRoles();

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

  const employeeId = await getEmployeeId(answer.employee);
  const roleId = await getRoleId(answer.role);

  const [results] = await connection.query("INSERT INTO employee SET ?", {
    first_name: answer.firstName,
    last_name: answer.lastName,
    role_id: roleId,
    manager_id: employeeId,
  });
  await prompt();
}

async function removeEmployee() {
  const names = await getNames();
  const answer = await inquirer.prompt({
    name: "employee",
    message: "Which employee do you want to remove?",
    type: "list",
    choices: names,
  });
  const employeeId = await getEmployeeId(answer.employee);

  const [results] = await connection.query("DELETE FROM employee WHERE ?", {
    id: employeeId,
  });
  await prompt();
}

async function updateEmployeeRole() {
  const names = await getNames();
  const roles = await getRoles();
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
  const roleId = await getRoleId(answer.role);
  const employeeId = await getEmployeeId(answer.employee);

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
  const names = await getNames();

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
  const employeeId = await getEmployeeId(answer.employee);
  const managerId = await getEmployeeId(answer.manager);

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
  const [rows] = await connection.query(`SELECT title FROM role`);
  console.table(rows);
  await prompt();
}

async function addRole() {
  const departments = await getDepartments();
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
  const departmentId = await getDepartmentId(answer.department);

  const [results] = await connection.query("INSERT INTO role SET ?", {
    title: answer.newRole,
    salary: answer.salary,
    department_id: departmentId,
  });
  await prompt();
}
async function removeRole() {
  const roles = await getRoles();
  const answer = await inquirer.prompt({
    name: "role",
    message: "Which role do you want to remove?",
    type: "list",
    choices: roles,
  });
  const roleId = await getRoleId(answer.role);

  const [results] = await connection.query("DELETE FROM role WHERE ?", {
    id: roleId,
  });
  await prompt();
}
async function viewDepartments() {
  const [rows] = await connection.query(`SELECT department FROM department`);
  console.table(rows);
  await prompt();
}
async function addDepartment() {
  const answer = await inquirer.prompt({
    name: "newDepartment",
    message: "What is the name of the new department?",
  });
  const [results] = await connection.query("INSERT INTO department SET ?", {
    department: answer.newDepartment,
  });
  await prompt();
}
async function removeDepartment() {
  const departments = await getDepartments();
  const answer = await inquirer.prompt({
    name: "department",
    message: "Which department do you want to remove?",
    type: "list",
    choices: departments,
  });
  const departmentId = await getDepartmentId(answer.department);
  const [results] = await connection.query("DELETE FROM department WHERE ?", {
    id: departmentId,
  });
  await prompt();
}
