import express from 'express';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';
import inquirer from 'inquirer';

await connectToDb();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//create this function to use as depts as dynamic list
async function fetchDepartments () {
  const result=await pool.query('SELECT * FROM department');
  return result.rows;

  
}

//need to add role function to be able to add to dynamic list to select role
async function fetchRoles () {
  const result=await pool.query ('SELECT * FROM roles');
  return result.rows;
  }

  //creating function to pull up results from employee table
  // async function fetchEmployees () {
  //   const result=await pool.query ('SELECT * FROM employee');
  //   return result.rows;
  //   }

//creating function to make allow for dynamic list for selecting Manager
async function fetchManager () {
   const result= await pool.query('SELECT manager_id FROM employee');
   return result.rows; 
}

//need function to handle fetching employee
async function fetchEmployees () {
  const result=await pool.query('SELECT * FROM employee')
  return result.rows; 
}
function handleError (err) {
  console.error('Database query error', err);
}

async function main() {}
const {choices}=await inquirer.prompt([

      {
        type: 'list',
        name: 'choices',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', "Add A Department", "Add A Role", "Add An Employee", "Update an Employee Role", "Quit"]

      }, 

    ]);

    
    switch(choices) {
//pulls up departments table
      case 'View All Departments':
      const departments= await fetchDepartments();
      console.log(departments);
      break;  
    

    //pulls up all results from row table
    case 'View All Roles':
    const roles= await fetchRoles();
    console.log(roles);
    break;  

    case 'View All Employee':
      const employees=await pool.query('SELECT * FROM employee');
      console.log(employees.rows);
      break;

      case 'Add a Department':
      const { newDepartment }=await inquirer.prompt([
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
      const { newRoleName, salary, department }=await inquirer.prompt([
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
          choices: (await fetchDepartments()).map(dept=> ({
            name: dept.name,
            value:dept.id, 

          })),  
        },

      ]);

      //updates roles table with new department 
      await pool.query('INSERT INTO roles (name, salary, department_id) VALUES ($1, $2, $3)', [newRoleName, salary, department]); 
      console.log(`Role ${newRoleName} added`); 
      break; 

      case 'Add an Employee':
      const { firstName, lastName, employeeRole, employeeManager, salary }=await inquirer.prompt([

        {
          type: 'input',
          name: 'firstName', 
          message:'Enter Employee First Name',
        },

        {
          type: 'input',
          name: 'lastName', 
          message:'Enter Employee Last Name',
        },

        {
          type: 'list',
          name: 'employeeRole', 
          message:'Select Employee Role',
          choices: (await fetchRoles()).map(role=>({
            name: role.name,
            value: role.id, 
          })),
        },

        {
          type:'list', 
          name: 'employeeManager',
          message: 'Select Employee Manager'
          choices: (await fetchManagers()).map(manager=> ({
            name: `${manager.first_name} ${manager.last_name}`, 
            value: manager.id, 
          })),
        }, 

        {
          type: 'input',
          name: 'empSalary', 
          message:'Enter Employee Salary'
        }, 

      await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id, salary) VALUES ($1, $2, $3, $4, $5)', [firstName, lastName, employeeRole, employeesManager, empSalary]); 
      console.log(`Employee ${firstName}${lastName} added`); 
      break; 

      ]);

      case 'Update an Enployee';
      const {employee, updateRole }=await inquiry.prompt ([

        type: 'list'
        name: 'employeeToUpdate'
        message: 'Select Employee to Update'
        choices: (await fetchEmployees()).map(employee=> ({
          name: employee.name,
          value:employee.id, 
        })), 
      ])

    


  
    }



  

  
  






  

   
  
  

 
     





















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

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
