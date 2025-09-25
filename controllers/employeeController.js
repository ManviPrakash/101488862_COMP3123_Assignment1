const Employee = require("../models/Employee");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

// GET /employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select("-__v");
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// GET /employees/:eid
exports.getEmployeeById = async (req, res) => {
  const { eid } = req.params;
  if (!mongoose.Types.ObjectId.isValid(eid))
    return res.status(400).json({ status: false, message: "Invalid employee ID" });

  try {
    const emp = await Employee.findById(eid).select("-__v");
    if (!emp) return res.status(404).json({ status: false, message: "Employee not found" });
    res.status(200).json(emp);
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// POST /employees
exports.createEmployee = async (req, res) => {
  await body("first_name").notEmpty().run(req);
  await body("last_name").notEmpty().run(req);
  await body("email").isEmail().withMessage("Valid email required").run(req);
  await body("position").notEmpty().run(req);
  await body("salary").isNumeric().run(req);
  await body("date_of_joining").isISO8601().toDate().run(req);
  await body("department").notEmpty().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ status: false, errors: errors.array() });

  try {
    const { first_name, last_name, email, position, salary, date_of_joining, department } = req.body;

    const employee = await Employee.create({
      first_name,
      last_name,
      email,
      position,
      salary,
      date_of_joining,
      department,
    });

    res
      .status(201)
      .json({ message: "Employee created successfully.", employee_id: employee._id });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// PUT /employees/:eid
exports.updateEmployee = async (req, res) => {
  const { eid } = req.params;
  if (!mongoose.Types.ObjectId.isValid(eid))
    return res.status(400).json({ status: false, message: "Invalid employee ID" });

  try {
    const updated = await Employee.findByIdAndUpdate(
      eid,
      { ...req.body, updated_at: Date.now() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ status: false, message: "Employee not found" });
    res.status(200).json({ message: "Employee details updated successfully." });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// DELETE /employees?eid=xxx
exports.deleteEmployee = async (req, res) => {
  const { eid } = req.query;
  if (!eid || !mongoose.Types.ObjectId.isValid(eid))
    return res.status(400).json({ status: false, message: "Invalid employee ID" });

  try {
    const deleted = await Employee.findByIdAndDelete(eid);
    if (!deleted) return res.status(404).json({ status: false, message: "Employee not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
