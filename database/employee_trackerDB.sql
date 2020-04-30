DROP DATABASE IF EXISTS employee_trackerDB;
CREATE DATABASE employee_trackerDB;
USE employee_trackerDB;

CREATE TABLE employee (
	id INTEGER AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    PRIMARY KEY (id)
);
    
CREATE TABLE role (
	id INTEGER AUTO_INCREMENT NOT NULL,
	title VARCHAR(30) NOT NULL,
	salary DECIMAL NOT NULL,
	department_id INTEGER NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE department (
	id INTEGER AUTO_INCREMENT NOT NULL,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Tate', 'Bell', 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Zakariya', 'Connolly', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Laylah', 'Klein', 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Benn', 'Valentine', 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Lorraine', 'Lister', 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Steffan', 'Hail', 6, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Elowen', 'Atkinson', 7, 6);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Richard', 'Petty', 3, 2);


INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ('Sales Person', 80000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ('Lead Engineer', 150000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ('Software Engineer', 120000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ('Accountant', 125000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ('Legal Team Lead', 250000, 4);
INSERT INTO role (title, salary, department_id)
VALUES ('Lawyer', 190000, 4);

INSERT INTO department (name)
VALUES ('Sales');
INSERT INTO department (name)
VALUES ('Engineering');
INSERT INTO department (name)
VALUES ('Finance');
INSERT INTO department (name)
VALUES ('Legal');






        