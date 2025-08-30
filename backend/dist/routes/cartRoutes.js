"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cartController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All cart routes require authentication
router.use(auth_1.auth);
router.get('/', cartController_1.getCart);
router.get('/count', cartController_1.getCartItemCount);
router.post('/add', cartController_1.addToCart);
router.put('/update', cartController_1.updateCartItem);
router.delete('/item/:productId', cartController_1.removeFromCart);
router.delete('/clear', cartController_1.clearCart);
exports.default = router;
//# sourceMappingURL=cartRoutes.js.map