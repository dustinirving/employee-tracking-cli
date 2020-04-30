// This function retrieves the full names of employees from the database
// The data is returned as an array of strings
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

// This function retrieves all the different roles form the database
// The results are returned in the form of an array as strings
async function getRoles() {
  const [rolesData] = await connection.query(`SELECT title FROM role`);
  const roles = [];
  rolesData.forEach((element) => {
    roles.push(element.title);
  });
  return roles;
}

// This function gets a list of all the departments from the database
// It returns an array of strings of the different departments
async function getDepartments() {
  const [departmentsData] = await connection.query(
    `SELECT name FROM department`
  );
  const departments = [];
  departmentsData.forEach((element) => {
    departments.push(element.name);
  });
  return departments;
}

// This function retrieves a particular employee id from the database
// A name is based into the function and it returns the id for that name
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

// A role is passed into this function and the id that corresponds to that role is returned
// The id is retrieved from the database
async function getRoleId(role) {
  const [roleIdData] = await connection.query("SELECT id FROM role WHERE ?", {
    title: role,
  });
  return roleIdData[0].id;
}

// This function retrieved the department id from the database that corresponds to the department that is passed in
async function getDepartmentId(department) {
  const [departmentIdData] = await connection.query(
    "SELECT id FROM department WHERE ?",
    {
      name: department,
    }
  );
  return departmentIdData[0].id;
}

// All the functions are exported for use in the index.js file
module.exports = {
  getNames: getNames,
  getRoles: getRoles,
  getDepartments: getDepartments,
  getEmployeeId: getEmployeeId,
  getRoleId: getRoleId,
  getDepartmentId: getDepartmentId,
};
