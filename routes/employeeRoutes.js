const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployees
} = require("../controllers/employeeController");

// SEARCH route
router.get("/employees/search", auth, searchEmployees);

// NORMAL CRUD routes
router.get("/employees", auth, getEmployees);
router.get("/employees/:eid", auth, getEmployeeById);

router.post("/employees", auth, upload.single("profileImage"), createEmployee);

router.put("/employees/:eid", auth, upload.single("profileImage"), updateEmployee);

router.delete("/employees/:eid", auth, deleteEmployee);

module.exports = router;
