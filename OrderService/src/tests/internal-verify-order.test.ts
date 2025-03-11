import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import Order from '../models/order.model';



describe('Internal Verify Order API Tests', () => {
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

  it('should verify if an order exists for internal services', async () => {
    // Create test order
    const order = await Order.create({
      userId: new mongoose.Types.ObjectId().toString(),
      items: [{ mkt: '30026', name: 'Test', price: '₪10', quantity: 1 }],
      totalAmount: 10,
      status: 'pending',
      shippingAddress: { address: 'Test Address' }
    });

    const response = await request(app)
      .post('/orders/internal/verify-order')
      .set('internal-access-token', process.env.INTERNAL_ACCESS_TOKEN as string)
      .send({ orderId: order.id.toString() });

    expect(response.status).toBe(200);
    // Updated expectations to match new response format
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('exists', true);
    expect(response.body).toHaveProperty('orderId');
    expect(response.body).toHaveProperty('status', 'pending');
  });

  it('should return 404 if order does not exist', async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();

    const response = await request(app)
      .post('/orders/internal/verify-order')
      .set('internal-access-token', process.env.INTERNAL_ACCESS_TOKEN as string)
      .send({ orderId: nonExistentId });

    expect(response.status).toBe(404);
    // Updated expectations to match new response format
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Order not found');
    expect(response.body).toHaveProperty('details.exists', false);
  });

  it('should return 400 if orderId is missing', async () => {
    const response = await request(app)
      .post('/orders/internal/verify-order')
      .set('internal-access-token', process.env.INTERNAL_ACCESS_TOKEN as string)
      .send({}); // Missing orderId

    expect(response.status).toBe(400);
    // Updated expectations to match new response format
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Order ID is required');
  });

  it('should return 403 without internal access token', async () => {
    const response = await request(app)
      .post('/orders/internal/verify-order')
      .send({ orderId: new mongoose.Types.ObjectId().toString() });

    expect(response.status).toBe(403);
    // Updated expectations to match new response format
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message');
  });
});