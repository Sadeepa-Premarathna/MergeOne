"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Placeholder routes for users
router.post('/register', (req, res) => {
    res.json({ message: 'User registration endpoint' });
});
router.post('/login', (req, res) => {
    res.json({ message: 'User login endpoint' });
});
router.get('/profile', auth_1.auth, (req, res) => {
    res.json({ message: 'User profile endpoint' });
});
exports.default = router;
//# sourceMappingURL=userRoutes.js.map