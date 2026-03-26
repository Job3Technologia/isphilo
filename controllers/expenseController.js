const Expense = require('../models/Expense');

exports.getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.findAll();
    res.json(expenses);
  } catch (err) {
    next(err);
  }
};

exports.getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Expense record not found' });
    res.json(expense);
  } catch (err) {
    next(err);
  }
};

exports.createExpense = async (req, res, next) => {
  try {
    const expenseId = await Expense.create(req.body);
    res.status(201).json({ msg: 'Expense record created', id: expenseId });
  } catch (err) {
    next(err);
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const success = await Expense.delete(req.params.id);
    if (!success) return res.status(404).json({ msg: 'Expense record not found' });
    res.json({ msg: 'Expense record deleted' });
  } catch (err) {
    next(err);
  }
};