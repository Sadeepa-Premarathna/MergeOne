"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Placeholder routes for orders
router.get('/', auth_1.auth, (req, res) => {
    res.json({ message: 'Get user orders endpoint' });
});
router.post('/', auth_1.auth, (req, res) => {
    res.json({ message: 'Create order endpoint' });
});
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map