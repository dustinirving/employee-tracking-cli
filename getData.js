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
    `SELECT name FROM department`
  );
  const departments = [];
  departmentsData.forEach((element) => {
    departments.push(element.name);
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
      name: department,
    }
  );
  return departmentIdData[0].id;
}

module.exports = {
  getNames: getNames,
  getRoles: getRoles,
  getDepartments: getDepartments,
  getEmployeeId: getEmployeeId,
  getRoleId: getRoleId,
  getDepartmentId: getDepartmentId,
};
