INSERT INTO department (name)
VALUES 
('Engineering'),
('Finance'), 
('Sales'),
('Human Resources');

INSERT INTO role (title, salary, department_id)
VALUES 
('Software Engineer', 75000, 1),
('Accountant', 55000, 2),
('Salesperson', 45000, 3),
('Human Resources Manager', 65000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('John', 'Doe', 1, NULL),
('Jane', 'Doe', 2, 4),
('John', 'Smith', 3, 1),
('Jane', 'Smith', 4, 2);