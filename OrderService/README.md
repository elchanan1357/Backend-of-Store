# Order Service API

This service manages the orders for the e-commerce platform. It provides endpoints for creating, retrieving, and managing orders in the system.

## Features

- Create new orders with product items
- Retrieve orders by ID
- Get all orders for a user
- Admin functionality to get all orders with pagination
- Update order status
- Internal verification of order existence
- Integration with Product Service for stock management

## Technical Stack

- **Node.js** with **Express.js** framework
- **TypeScript** for type safety
- **MongoDB** (mongoose) for data storage
- **JWT** for authentication
- **class-validator** for request validation
- **Jest** for testing

## Project Structure

```
order-service/
├── src/
│   ├── controllers/         # Request handlers
│   ├── dtos/                # Data Transfer Objects
│   ├── middlewares/         # Auth and validation middlewares
│   ├── models/              # Mongoose data models
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── tests/               # Unit and integration tests
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Helper utilities (logging, error handling)
│   └── app.ts               # Express application setup
├── logs/                    # Application logs
├── .env                     # Environment variables
└── README.md                # This file
```

## Configuration

The service uses environment variables for configuration:

- `PORT`: Server port (default: 3002)
- `DB_CONNECTION_URL`: MongoDB connection string
- `SESSION_SECRET`: Secret for JWT token validation
- `PRODUCT_SERVICE_URL`: URL of the Product Service
- `INTERNAL_ACCESS_TOKEN`: Token for internal service communication
- `CORS_ORIGIN`: Allowed origins for CORS
- `NODE_ENV`: Environment (development, production, test)

## API Endpoints

### Orders

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/orders` | Create a new order | Required |
| GET | `/orders/:id` | Get an order by ID | Required (owner or admin) |
| GET | `/orders/user/me` | Get logged-in user's orders | Required |
| GET | `/orders` | Get all orders with pagination | Required (admin only) |
| PUT | `/orders/:id/status` | Update order status | Required (admin only) |
| POST | `/orders/internal/verify-order` | Verify if order exists | Internal token required |

### Response Format

All API responses follow a consistent format:

```json
{
  "success": true|false,
  "message": "Human-readable message",
  "data or specific fields": "..."
}
```

For errors:
```json
{
  "success": false,
  "message": "Error message",
  "details": "..." // Optional error details
}
```

## Authentication

This service uses JWT tokens for authentication. The token should be provided in one of two ways:
- As a cookie named `auth-token`
- As a header named `auth-token`

For internal service communication, use the `internal-access-token` header.

## Running the Service

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables in `.env` file

3. Start the service:
   ```
   npm start
   ```

4. For development with auto-reload:
   ```
   npm run dev
   ```

## Testing

Run tests with:
```
npm test
```

Run tests with coverage:
```
npm run test:coverage
```

## API Usage Examples

### Create Order

```
POST /orders
```

Request body:
```json
{
  "items": [
    {
      "mkt": "30029",
      "name": "Headphones QuietComfort",
      "price": "₪899",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "address": "123 Main St, Tel Aviv, Israel"
  }
}
```

### Get User's Orders

```
GET /orders/user/me
```

### Get Order by ID

```
GET /orders/12345
```

### Update Order Status

```
PUT /orders/12345/status
```

Request body:
```json
{
  "status": "completed"
}
```

## Error Handling

The service provides detailed error messages with appropriate HTTP status codes:

- `400` - Bad Request (validation errors, invalid input)
- `401` - Unauthorized (missing or invalid authentication)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (unexpected errors)

## Logging

The service uses a structured logging system that records:
- HTTP requests and responses
- Service-to-service communications
- Errors and warnings
- General application info

Logs are stored in the `logs` directory and also output to the console.