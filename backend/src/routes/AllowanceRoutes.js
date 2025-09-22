const express = require('express');
const { getAllAllowances, createAllowance, updateAllowance, deleteAllowance } = require('../Controllers/AllowanceController.js');

const router = express.Router();

router.get('/', getAllAllowances);
router.post('/', createAllowance);
router.put('/:id', updateAllowance);
router.delete('/:id', deleteAllowance);

module.exports = router;
