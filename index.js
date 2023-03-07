const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./config/connection');
const mysql = require('mysql2');

//function to start the application
function startApp() {
    //prompt user to select an option
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    }).then((answer) => {
        //switch statement to handle user input
        switch (answer.action) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Exit':
                db.end();
                break;
        }
    });
}

//function to view all departments
function viewDepartments() {
    //query to select all departments
    db.query('SELECT * FROM department', (err, results) => {
        if (err) {
            console.log(err);
        }
        //display results in a table
        console.table(results);
        startApp();
    });
}

//function to view all roles
function viewRoles() {
    //query to select all roles
    db.query('SELECT * FROM role', (err, results) => {
        if (err) {
            console.log(err);
        }
        //display results in a table
        console.table(results);
        startApp();
    });
}

//function to view all employees
function viewEmployees() {
    //query to select all employees
    db.query('SELECT * FROM employee', (err, results) => {
        if (err) {
            console.log(err);
        }
        //display results in a table
        console.table(results);
        startApp();
    });
}

//function to add a department
function addDepartment() {
    //prompt user for department name
    inquirer.prompt({
        name: 'department',
        type: 'input',
        message: 'What is the name of the department you would like to add?'
    }).then((answer) => {
        //query to insert new department
        db.query('INSERT INTO department SET ?', { name: answer.department }, (err, results) => {
            if (err) {
                console.log(err);
            }
            console.log('Department added!');
            startApp();
        });
    });
}

//function to add a role
function addRole() {
    //query to select all departments
    db.query('SELECT * FROM department', (err, results) => {
        if (err) {
            console.log(err);
        }
        //prompt user for role information
        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What is the title of the role you would like to add?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of the role you would like to add?'
            },
            {
                name: 'department',
                type: 'list',
                message: 'What department does this role belong to?',
                choices: results.map(department => department.name)
            }
        ]).then((answer) => {
            //query to insert new role
            db.query('INSERT INTO role SET ?', { title: answer.title, salary: answer.salary, department_id: results.find(department => department.name === answer.department).id }, (err, results) => {
                if (err) {
                    console.log(err);
                }
                console.log('Role added!');
                startApp();
            });
        });
    });
}

//function to add an employee
function addEmployee() {
    //query to select all roles
    db.query('SELECT * FROM role', (err, results) => {
        if (err) {
            console.log(err);
        }
        //prompt user for employee information
        inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: "What is the employee's first name?"
            },
            {
                name: 'lastName',
                type: 'input',
                message: "What is the employee's last name?"
            },
            {
                name: 'role',
                type: 'list',
                message: "What is the employee's role?",
                choices: results.map(role => role.title)
            }
        ]).then((answer) => {
            //query to insert new employee
            db.query('INSERT INTO employee SET ?', { first_name: answer.firstName, last_name: answer.lastName, role_id: results.find(role => role.title === answer.role).id }, (err, results) => {
                if (err) {
                    console.log(err);
                }
                console.log('Employee added!');
                startApp();
            });
        });
    });
}

//function to update an employee's role
function updateEmployeeRole() {
    //query to select all employees
    db.query('SELECT * FROM employee', (err, results) => {
        if (err) {
            console.log(err);
        }
        //prompt user for employee to update
        inquirer.prompt({
            name: 'employee',
            type: 'list',
            message: 'Which employee would you like to update?',
            choices: results.map(employee => `${employee.first_name} ${employee.last_name}`)
        }).then((answer) => {
            //query to select all roles
            db.query('SELECT * FROM role', (err, results) => {
                if (err) {
                    console.log(err);
                }
                //prompt user for new role
                inquirer.prompt({
                    name: 'role',
                    type: 'list',
                    message: 'What is the new role?',
                    choices: results.map(role => role.title)
                }).then((answer2) => {
                    //query to update employee's role
                    db.query('UPDATE employee SET ? WHERE ?', [{ role_id: results.find(role => role.title === answer2.role).id }, { id: results.find(employee => `${employee.first_name} ${employee.last_name}` === answer.employee).id }], (err, results) => {
                        if (err) {
                            console.log(err);
                        }
                        console.log('Employee role updated!');
                        startApp();
                    });
                });
            });
        });
    });
}