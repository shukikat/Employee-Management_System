import express from 'express';
//import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';
import inquirer from 'inquirer';

await connectToDb();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//create this function to use as depts as dynamic list
async function fetchDepartments() {
  try {
  const result = await pool.query('SELECT * FROM department');
  return result.rows;
  } catch (err: unknown){
    if (err instanceof Error){
    handleError(err);}
    else {
      console.error('An Unknown error occurred', err);
    }
    return[];
  }


}

//need to add role function to be able to add to dynamic list to select role
async function fetchRoles() {
  try {
  const queryResult = await pool.query('SELECT * FROM role');
  return queryResult.rows;
  } catch(err:unknown){
    if (err instanceof Error){
      handleError(err);
    }
    else {
      console.error('An Unknown error', err)
    }
    return[];
  }

}


//creating function to make allow for dynamic list for selecting Manager/need to 
//needed to add error handling 
async function fetchManager() {
  try {
  const result = await pool.query('SELECT e.id, e.first_name, e.last_name, r.title AS role_name, m.first_name AS manager_first_name,m.last_name AS manager_last_name FROM employee e LEFT JOIN role r ON e.role_id=r.id LEFT JOIN employee m ON e.manager_id=m.id');
  return result.rows;
  }

  catch(err:unknown){
    if (err instanceof Error){
      handleError(err);
    }
    else {
      console.error('An unknown error has occurred', err)
    }
    return [];
  }
}

//need function to handle fetching employee
async function fetchEmployees() {
  
  try { 
  const result = await pool.query('SELECT * FROM employee')
  return result.rows;
  }

  catch(err:unknown) {
    if (err instanceof Error){
      handleError(err);
    }
    else {
      console.error('An unknown error occurred', err)
    }
  }
  return [];
}

function handleError(err: unknown) {
  console.error('Database query error', err);
}

async function main() {
  const { choices } = await inquirer.prompt([

    {
      type: 'list',
      name: 'choices',
      message: 'What would you like to do?',
      choices: ['View All Departments', 'View All Roles', 'View All Employees', "Add A Department", "Add A Role", "Add An Employee", "Update an Employee Role", "Quit"]

    },

  ]);


  switch (choices) {
    //pulls up departments table
    case 'View All Departments':
      const departments = await fetchDepartments();
      console.table(departments);
      break;


    //pulls up all results from row table
    case 'View All Roles':
      const roles = await fetchRoles();
      console.table(roles);
      break;

    case 'View All Employee':
      const employees = await pool.query('SELECT * FROM employee');
      console.table(employees.rows);
      break;

    case 'Add a Department':
      const { newDepartment } = await inquirer.prompt([
        {
          type: 'input',
          name: 'newDepartment',
          message: 'Add a Name of Department',
        },
      ]);

      await pool.query('INSERT INTO department (name) VALUES ($1)', [newDepartment]);
      console.log(`Department ${newDepartment} added.`);
      break;

    //logic to handle when user selects to add a new role
    case 'Add a Role':
      const { newRoleName, salary, department } = await inquirer.prompt([
        {
          type: 'input',
          name: 'newRoleName',
          message: 'Name of New Role'
        },

        {
          type: 'input',
          name: 'salary',
          message: 'Input Salary',
        },

        // select from list of departments
        {
          type: 'list',
          name: 'department',
          message: 'Select Department for Role',
          choices: (await fetchDepartments() || []).map(dept => ({
            name: dept.name,
            value: dept.id,

          })),
        },

      ]);

      //updates roles table with new department 
      try {
      const salaryNumber=parseFloat(salary);
      await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [newRoleName, salaryNumber, department]);
      console.log(`Role ${newRoleName} added`);
      }
      catch(error) {
        console.error('Error adding role:', error);
      }
      break;

    //having some issues--1.  User chooses to add employees 2. Prompt to enter first name 
    //3.Prompt to enter last name 4. Role (needs to be a list of roles) 5. Manager (need to be list of employees)
    //6. add salary 7. RESULTS: table needs update Employee table --Q: how do I get manager id to update
    case 'Add an Employee':
      const { firstName, lastName, employeeRole, employeeManager, } = await inquirer.prompt([

        {
          type: 'input',
          name: 'firstName',
          message: 'Enter Employee First Name',
          validate: (firstName) => {
            if (!firstName) {
              return 'Please provide first name'
            }
            return true;
          }
        },

        {
          type: 'input',
          name: 'lastName',
          message: 'Enter Employee Last Name',
          validate: (lastName) => {
            if (!lastName) {
              return 'Please provide last name'
            }
            return true;
          }


        },

        {
          type: 'list',
          name: 'employeeRole',
          message: 'Select Employee Role',
          choices: (await fetchRoles() || []).map(role => ({
            name: role.name,
            value: role.id,
          })),
        },

        {
          type: 'list',
          name: 'employeeManager',
          message: 'Select Employee Manager',
          choices: [{name: "None", value: null}, ...(await fetchManager()).map(manager => ({
            name: `${manager.first_name} ${manager.last_name}`,
            value: manager.id,
          })),
        ],

        },

      ]);
      await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [firstName, lastName, employeeRole, employeeManager]);
      console.log(`Employee ${firstName}${lastName} added`);
      break;

    //case to update role for selected employee

    case 'Update an Employee':
      const { employeeToUpdate, updatedRole } = await inquirer.prompt([
        {
          type: 'list',
          name: 'employeeToUpdate',
          message: 'Select Employee to Update',
          choices: (await fetchEmployees()).map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        },

        {
          type: 'list',
          name: 'updatedRole',
          message: 'Select Employee Role',
          choices: (await fetchRoles()).map(role => ({
            name: role.title,
            value: role.id,

          })),

        },



      ]);

      await pool.query('UPDATE employee SET role_id=$1 WHERE id=$2', [updatedRole, employeeToUpdate]);
      const updatedEmployee = await (await fetchEmployees()).find(emp => emp.id === employeeToUpdate);
      console.log(`Employee ${updatedEmployee.firstName}${updatedEmployee.lastName} updated`);
      break;

    case 'Quit':
      process.exit();







      



  }

  main()
  
}

main()














































// function resolve(resolve: (value: unknown) => void, reject: (reason?: any) => void): void {
//   throw new Error('Function not implemented.');
// }

// function reject(err: Error) {
//   throw new Error('Function not implemented.');
// }

// function last_name(err: Error, result: QueryResult<any>): void {
//   throw new Error('Function not implemented.');
// }
// Hardcoded query: DELETE FROM course_names WHERE id = 3;
// pool.query(`DELETE FROM course_names WHERE id = $1`, [3], (err: Error, result: QueryResult) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(`${result.rowCount} row(s) deleted!`);
//   }
// });

// Query database
// pool.query('SELECT * FROM course_names', (err: Error, result: QueryResult) => {
//   if (err) {
//     console.log(err);
//   } else if (result) {
//     console.log(result.rows);
//   }
// });

// // Default response for any other request (Not Found)
// app.use((_req, res) => {
//   res.status(404).end();
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
