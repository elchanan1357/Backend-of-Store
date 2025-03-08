// src/routes/order.routes.ts
import { Router } from 'express';
import orderController from '../controllers/order.controller';
import { authenticateUser, isAdmin, validateInternalToken } from '../middlewares/auth.middleware';

const router = Router();

// create order
router.post('/', authenticateUser, orderController.createOrder);

// get order by id
router.get('/:id', authenticateUser, orderController.getOrderById);

// get user order
router.get('/user/me', authenticateUser, orderController.getUserOrders);

// get all orders (admin only)
router.get('/', authenticateUser, isAdmin, orderController.getAllOrders);

// update orders (admin only)
router.put('/:id/status', authenticateUser, isAdmin, orderController.updateOrderStatus);

// internal endpoint of verify order
router.post('/internal/verify-order', validateInternalToken, orderController.verifyOrderExists);

export default router;