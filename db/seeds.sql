INSERT INTO department (name)
VALUES ('Engineering'),
       ('Custodial Services');

INSERT INTO role (title, salary, dept_id )
VALUES ('Developer', 50000, 1), 
       ('Janitor', 80000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id )
VALUES ('Bill','Smith', 1, NULL), 
       ('Jaya',"Maya",  2, 1);



      
       
