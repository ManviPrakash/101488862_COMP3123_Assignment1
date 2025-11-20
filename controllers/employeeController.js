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
  await body("email").isEmail().run(req);
  await body("position").notEmpty().run(req);
  await body("salary").isNumeric().run(req);
  await body("date_of_joining").notEmpty().run(req);
  await body("department").notEmpty().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ status: false, errors: errors.array() });

  try {
    const employeeData = { ...req.body };

    if (req.file) employeeData.profileImage = req.file.filename;

    const employee = await Employee.create(employeeData);

    res.status(201).json({
      message: "Employee created successfully.",
      employee_id: employee._id,
    });
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
    const updatedData = { ...req.body, updated_at: Date.now() };

    if (req.file) updatedData.profileImage = req.file.filename;

    const updated = await Employee.findByIdAndUpdate(eid, updatedData, { new: true });
    if (!updated)
      return res.status(404).json({ status: false, message: "Employee not found" });

    res.status(200).json({ message: "Employee details updated successfully." });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// DELETE /employees/:eid
exports.deleteEmployee = async (req, res) => {
  const { eid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eid))
    return res.status(400).json({ status: false, message: "Invalid employee ID" });

  try {
    const deleted = await Employee.findByIdAndDelete(eid);
    if (!deleted)
      return res.status(404).json({ status: false, message: "Employee not found" });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// SEARCH
exports.searchEmployees = async (req, res) => {
  try {
    const { department, position } = req.query;
    let query = {};

    if (department) query.department = department;
    if (position) query.position = position;

    const employees = await Employee.find(query);

    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: "Search error", error: err.message });
  }
};
