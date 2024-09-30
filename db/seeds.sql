INSERT INTO department (name)
VALUES ('Engineering'),
       ('Custodial Services')
ON CONFLICT (name) DO NOTHING;

INSERT INTO role (title, salary, department_id )
VALUES ('Developer', 50000, 1), 
       ('Janitor', 80000, 2)
ON CONFLICT (title) DO NOTHING;

INSERT INTO employee (first_name, last_name, role_id, manager_id )
VALUES ('Bill','Smith', 1, NULL), 
       ('Jaya','Maya',  2, 1)
ON CONFLICT (first_name, last_name) DO NOTHING;



      
       
