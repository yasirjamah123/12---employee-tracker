-- seeds.sql

-- Create department table
CREATE TABLE IF NOT EXISTS department (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL
);

-- Insert data into department table
INSERT INTO department (name) VALUES
  ('Engineering'),
  ('Finance'),
  ('Legal'),
  ('Sales');

-- Create role table
CREATE TABLE IF NOT EXISTS role (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Insert data into role table
INSERT INTO role (title, salary, department_id) VALUES
  ('Lead Engineer', 100000.00, 1),
  ('Software Engineer', 80000.00, 1),
  ('Legal Team Lead', 120000.00, 3),
  ('Lawyer', 100000.00, 3),
  ('Customer Service', 50000.00, 4),
  ('Sales Lead', 120000.00, 4),
  ('Salesperson', 80000.00, 4);

-- Create employee table
CREATE TABLE IF NOT EXISTS employee (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);


-- Insert data into employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Bob', 'Johnson', 3, 1),
  ('Alice', 'Williams', 4, 3),
  ('Charlie', 'Brown', 5, 3),
  ('Eva', 'Miller', 6, 4),
  ('Frank', 'Jones', 7, 6);
