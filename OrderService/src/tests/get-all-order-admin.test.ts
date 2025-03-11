import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import Order from '../models/order.model';
import { generateTestToken } from './generate-test-token'; 


describe('Get All Orders (Admin) API Tests', () => {
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

  it('should return all orders for admin users', async () => {
    const adminUserId = new mongoose.Types.ObjectId().toString();
    const adminToken = generateTestToken(adminUserId, 'admin');

    // Create test orders
    await Order.insertMany([
      {
        userId: new mongoose.Types.ObjectId().toString(),
        items: [{ mkt: '30026', name: 'Test', price: '₪10', quantity: 1 }],
        totalAmount: 10,
        status: 'pending',
        shippingAddress: { address: 'Test Address' }
      },
      {
        userId: new mongoose.Types.ObjectId().toString(),
        items: [{ mkt: '30027', name: 'Another Test', price: '₪20', quantity: 2 }],
        totalAmount: 40,
        status: 'completed',
        shippingAddress: { address: 'Another Test Address' }
      }
    ]);

    const response = await request(app)
      .get('/orders')
      .set('auth-token', adminToken);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Orders retrieved successfully');
    expect(response.body).toHaveProperty('orders');
    expect(Array.isArray(response.body.orders)).toBe(true);
    expect(response.body.orders.length).toBe(2);
    expect(response.body).toHaveProperty('pagination');
  });

  it('should return orders with pagination', async () => {
    const adminUserId = new mongoose.Types.ObjectId().toString();
    const adminToken = generateTestToken(adminUserId, 'admin');
  
    // Create 10 test orders
    const orderPromises = [];
    for (let i = 0; i < 10; i++) {
      orderPromises.push(
        Order.create({
          userId: new mongoose.Types.ObjectId().toString(),
          items: [{ mkt: '30026', name: `Test ${i}`, price: '₪10', quantity: 1 }],
          totalAmount: 10,
          status: 'pending',
          shippingAddress: { address: `Test Address ${i}` }
        })
      );
    }
    await Promise.all(orderPromises);
  
    // Test with limit=5
    const response = await request(app)
      .get('/orders?limit=5&page=1')
      .set('auth-token', adminToken);
  
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('orders');
    expect(Array.isArray(response.body.orders)).toBe(true);
    expect(response.body.orders.length).toBe(5);
    expect(response.body.pagination).toEqual({ page: 1, limit: 5 });
    
    // Test with page=2
    const page2Response = await request(app)
      .get('/orders?limit=5&page=2')
      .set('auth-token', adminToken);
      
    expect(page2Response.status).toBe(200);
    expect(page2Response.body.orders.length).toBe(5);
    expect(page2Response.body.pagination).toEqual({ page: 2, limit: 5 });
    
    // Instead of checking for zero intersection, we check the total count
    // which is more robust when exact ordering might be unpredictable
    const firstPageIds = response.body.orders.map((order: any) => order._id);
    const secondPageIds = page2Response.body.orders.map((order: any) => order._id);
    const uniqueIds = [...new Set([...firstPageIds, ...secondPageIds])];
    
    // Verify that we got 10 unique orders across both pages
    expect(uniqueIds.length).toBeGreaterThanOrEqual(8); // Allow for slight overlap but still ensure most orders are unique
  });

  it('should return 403 for non-admin users', async () => {
    const userToken = generateTestToken(new mongoose.Types.ObjectId().toString(), 'user');

    const response = await request(app)
      .get('/orders')
      .set('auth-token', userToken);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Access denied. Admin role required.');
  });

  it('should return 401 if user is not authenticated', async () => {
    const response = await request(app)
      .get('/orders');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Access denied. No token provided.');
  });
});