-- Drop the database if it already exists
DROP DATABASE IF EXISTS employee_trackerDB;
-- Create a database
CREATE DATABASE employee_trackerDB;
-- Use the database
USE employee_trackerDB;

-- Create a table named employee with id, first name, last name, role id and manager id
CREATE TABLE employee (
	id INTEGER AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    PRIMARY KEY (id)
);

-- Create a table named role with id, title, salary, department
CREATE TABLE role (
	id INTEGER AUTO_INCREMENT NOT NULL,
	title VARCHAR(30) NOT NULL,
	salary DECIMAL NOT NULL,
	department_id INTEGER NOT NULL,
	PRIMARY KEY (id)
);

-- Create a table department with id and name
CREATE TABLE department (
	id INTEGER AUTO_INCREMENT NOT NULL,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);