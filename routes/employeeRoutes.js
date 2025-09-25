const express = require("express");
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

// Optional: JWT middleware to protect routes
// const { protect } = require("../middleware/authMiddleware");

router.get("/employees", /*protect,*/ getEmployees);
router.get("/employees/:eid", /*protect,*/ getEmployeeById);
router.post("/employees", /*protect,*/ createEmployee);
router.put("/employees/:eid", /*protect,*/ updateEmployee);
router.delete("/employees", /*protect,*/ deleteEmployee);

module.exports = router;
