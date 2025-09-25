# 101488862_COMP3123_Assignment1(Backend)

📌 Project Overview

This project is a RESTful API built with Node.js, Express, and MongoDB for managing Users and Employees.

Users can sign up and log in (with hashed passwords and validation).

Employees can be created, listed, fetched by ID, updated, and deleted.

All data is stored in MongoDB database comp3123_assigment1.

⚙️ Tech Stack

Backend: Node.js + Express

Database: MongoDB + Mongoose

Validation: express-validator

Authentication: bcrypt (hashing), JWT (optional)

Testing: Postman

📂 API Endpoints
User Endpoints
Method	Endpoint	Status	Description
POST	/api/v1/user/signup	201	Create new user
POST	/api/v1/user/login	200	Login user (username/email + password)
Employee Endpoints
Method	Endpoint	Status	Description
GET	/api/v1/emp/employees	200	List all employees
POST	/api/v1/emp/employees	201	Create new employee
GET	/api/v1/emp/employees/{eid}	200	Get employee by ID
PUT	/api/v1/emp/employees/{eid}	200	Update employee by ID
DELETE	/api/v1/emp/employees?eid={eid}	204	Delete employee by ID
🧪 Testing with Postman

Import the included Postman collection (COMP3123_Assignment1.postman_collection.json).

Test all 7 endpoints.

Example requests/responses:

✅ Signup

✅ Login

✅ Create Employee

✅ Get Employee by ID

✅ Update Employee

✅ Delete Employee

📸 Screenshots of tests are included in /screenshots.

📊 Database

Database: comp3123_assigment1

Collections:

users

employees

📸 MongoDB screenshots included in submission.

🧑🏻‍💻 Sample Credentials
username: johndoe
email: johndoe@example.com
password: password123

📦 Deliverables

✅ GitHub repo: <your-student-number>_COMP3123_Assignment1

✅ ZIP file (without node_modules)

✅ Postman collection JSON

✅ Screenshots (MongoDB + Postman tests)

✅ README.md (this file)
