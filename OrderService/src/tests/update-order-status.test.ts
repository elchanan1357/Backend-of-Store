import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import Order from '../models/order.model';

import { generateTestToken } from './generate-test-token'; 

describe('Update Order Status API Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.DB_CONNECTION_URL as string);
  });

  afterAll(async () => {
    // Disconnect from test database
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear database before each test
    await Order.deleteMany({});
  });

  it('should update order status as admin', async () => {
    const adminUserId = new mongoose.Types.ObjectId().toString();
    const adminToken = generateTestToken(adminUserId, 'admin');

    const order = await Order.create({
      userId: new mongoose.Types.ObjectId().toString(),
      items: [{ mkt: '30026', name: 'Test', price: '₪10', quantity: 1 }],
      totalAmount: 10,
      status: 'pending',
      shippingAddress: { address: 'Test Address' }
    });

    const response = await request(app)
      .put(`/orders/${order.id}/status`)
      .set('auth-token', adminToken)
      .send({ status: 'completed' });

    // Check response format
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Order status updated successfully');
    expect(response.body).toHaveProperty('order');
    expect(response.body.order).toHaveProperty('status', 'completed');

    // Verify status was updated in database
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder?.status).toBe('completed');
  });

  it('should support all valid status values', async () => {
    const adminUserId = new mongoose.Types.ObjectId().toString();
    const adminToken = generateTestToken(adminUserId, 'admin');

    const order = await Order.create({
      userId: new mongoose.Types.ObjectId().toString(),
      items: [{ mkt: '30026', name: 'Test', price: '₪10', quantity: 1 }],
      totalAmount: 10,
      status: 'pending',
      shippingAddress: { address: 'Test Address' }
    });

    // Test each valid status
    const validStatuses = ['processing', 'completed', 'cancelled'];
    
    for (const status of validStatuses) {
      const response = await request(app)
        .put(`/orders/${order.id}/status`)
        .set('auth-token', adminToken)
        .send({ status });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.order).toHaveProperty('status', status);
      
      // Verify status was updated in database
      const updatedOrder = await Order.findById(order.id);
      expect(updatedOrder?.status).toBe(status);
    }
  });

  it('should return 403 for non-admin users', async () => {
    const userToken = generateTestToken(new mongoose.Types.ObjectId().toString(), 'user');

    const order = await Order.create({
      userId: new mongoose.Types.ObjectId().toString(),
      items: [{ mkt: '30026', name: 'Test', price: '₪10', quantity: 1 }],
      totalAmount: 10,
      status: 'pending',
      shippingAddress: { address: 'Test Address' }
    });

    const response = await request(app)
      .put(`/orders/${order.id}/status`)
      .set('auth-token', userToken)
      .send({ status: 'completed' });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Access denied. Admin role required.');
  });

  it('should return 400 for invalid status', async () => {
    const adminUserId = new mongoose.Types.ObjectId().toString();
    const adminToken = generateTestToken(adminUserId, 'admin');

    const order = await Order.create({
      userId: new mongoose.Types.ObjectId().toString(),
      items: [{ mkt: '30026', name: 'Test', price: '₪10', quantity: 1 }],
      totalAmount: 10,
      status: 'pending',
      shippingAddress: { address: 'Test Address' }
    });

    const response = await request(app)
      .put(`/orders/${order.id}/status`)
      .set('auth-token', adminToken)
      .send({ status: 'invalid-status' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Valid status (pending, processing, completed, cancelled) is required');
  });

  it('should return 404 when order does not exist', async () => {
    const adminUserId = new mongoose.Types.ObjectId().toString();
    const adminToken = generateTestToken(adminUserId, 'admin');
    const nonExistentId = new mongoose.Types.ObjectId().toString();

    const response = await request(app)
      .put(`/orders/${nonExistentId}/status`)
      .set('auth-token', adminToken)
      .send({ status: 'completed' });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Order not found');
  });

  it('should return 401 if user is not authenticated', async () => {
    const orderId = new mongoose.Types.ObjectId().toString();

    const response = await request(app)
      .put(`/orders/${orderId}/status`)
      .send({ status: 'completed' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Access denied. No token provided.');
  });
});